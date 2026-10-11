import {lookup} from 'node:dns/promises';
import {request as httpRequest} from 'node:http';
import {request as httpsRequest} from 'node:https';
import {BlockList,isIP} from 'node:net';
import {postLinks} from '../mobile/post-links.mjs';
const blocked=new BlockList();
for(const [base,bits] of [['0.0.0.0',8],['10.0.0.0',8],['100.64.0.0',10],['127.0.0.0',8],['169.254.0.0',16],['172.16.0.0',12],['192.0.0.0',24],['192.0.2.0',24],['192.168.0.0',16],['198.18.0.0',15],['198.51.100.0',24],['203.0.113.0',24],['224.0.0.0',4],['240.0.0.0',4]])blocked.addSubnet(base,bits,'ipv4');
export function publicAddress(ip){return isIP(ip)===4&&!blocked.check(ip,'ipv4');}
export function previewURL(value,base){const url=new URL(value,base);if(!['http:','https:'].includes(url.protocol)||url.username||url.password||url.port||!url.hostname||url.hostname==='localhost'||url.hostname.endsWith('.localhost')||url.hostname.endsWith('.local'))throw new Error('Unsupported preview URL');if(isIP(url.hostname)&&!publicAddress(url.hostname))throw new Error('Non-public preview address');return url;}
async function safeDownload(value,maxBytes,redirects=0,deadline=Date.now()+4000){
 const url=previewURL(value);
 // Resolve once and pin the socket to a checked public IPv4 address.
 let dnsTimer;const addresses=await Promise.race([lookup(url.hostname,{all:true,family:4}),new Promise((_,reject)=>{dnsTimer=setTimeout(()=>reject(new Error('Preview DNS timed out')),Math.max(1,Math.min(2000,deadline-Date.now())));})]).finally(()=>clearTimeout(dnsTimer));
 if(Date.now()>=deadline)throw new Error('Preview timed out');
 if(!addresses.length||addresses.some(x=>!publicAddress(x.address)))throw new Error('Non-public preview address');
 const address=addresses[0].address;
 const response=await new Promise((resolve,reject)=>{
  const request=(url.protocol==='https:'?httpsRequest:httpRequest)(url,{agent:false,family:4,lookup:(_host,options,callback)=>options.all?callback(null,[{address,family:4}]):callback(null,address,4),headers:{'User-Agent':'GatherLinkPreview/1.0','Accept':'text/html,image/*;q=0.8','Accept-Encoding':'identity'}},res=>{
   const chunks=[];let size=0;
   res.on('data',chunk=>{size+=chunk.length;if(size>maxBytes){res.destroy();request.destroy(new Error('Preview exceeds size limit'));}else chunks.push(chunk);});
   res.on('error',reject);res.on('end',()=>resolve({status:res.statusCode,headers:res.headers,bytes:Buffer.concat(chunks),url:url.href}));
  });
  const timer=setTimeout(()=>request.destroy(new Error('Preview timed out')),Math.max(1,deadline-Date.now()));
  request.on('error',reject);request.on('close',()=>clearTimeout(timer));request.end();
 });
 if([301,302,303,307,308].includes(response.status)&&response.headers.location){if(redirects>=3)throw new Error('Too many preview redirects');return safeDownload(previewURL(response.headers.location,url).href,maxBytes,redirects+1,deadline);}
 if(response.status!==200)throw new Error('Preview unavailable');return response;
}
function decode(value){return value.replace(/&(?:amp|quot|apos|lt|gt|#39|#x[0-9a-f]+|#\d+);/gi,entity=>{const named={'&amp;':'&','&quot;':'"','&apos;':"'",'&lt;':'<','&gt;':'>','&#39;':"'"};const key=entity.toLowerCase();if(named[key])return named[key];const n=key.startsWith('&#x')?parseInt(key.slice(3,-1),16):parseInt(key.slice(2,-1),10);return Number.isFinite(n)&&n>0&&n<=0x10ffff?String.fromCodePoint(n):'';});}
export function extractPreview(html,url){
 const meta=new Map();
 for(const tag of html.matchAll(/<meta\b[^>]*>/gi)){
  const attrs={};for(const m of tag[0].matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g))attrs[m[1].toLowerCase()]=decode(m[2]??m[3]??m[4]);
  const key=(attrs.property||attrs.name||'').toLowerCase();if(key&&!meta.has(key))meta.set(key,attrs.content||'');
 }
 const title=meta.get('og:title')||meta.get('twitter:title')||decode(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]||'');
 const description=meta.get('og:description')||meta.get('twitter:description')||meta.get('description')||'';
 let image=null;try{const candidate=meta.get('og:image:secure_url')||meta.get('og:image')||meta.get('twitter:image');if(candidate)image=previewURL(candidate,url).href;}catch{}
 return {url,domain:new URL(url).hostname,title:title.replace(/\s+/g,' ').trim().slice(0,200),description:description.replace(/\s+/g,' ').trim().slice(0,300),image};
}
function imageType(bytes){if(bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))return 'image/png';if(bytes[0]===255&&bytes[1]===216&&bytes[2]===255)return 'image/jpeg';if(bytes.toString('ascii',0,4)==='RIFF'&&bytes.toString('ascii',8,12)==='WEBP')return 'image/webp';if(['GIF87a','GIF89a'].includes(bytes.toString('ascii',0,6)))return 'image/gif';return null;}
export function createLinkPreviews({download=safeDownload}={}){
 const cache=new Map();let busy=0;
 async function get(url){
  const previous=cache.get(url);if(previous&&previous.expires>Date.now())return previous.promise;
  if(busy>=6)return null;
  const promise=(async()=>{busy++;try{
   const page=await download(url,512*1024);if(!String(page.headers['content-type']||'').includes('text/html'))return null;
   const preview=extractPreview(page.bytes.toString('utf8'),page.url);preview.url=url;
   if(preview.image){try{const image=await download(preview.image,512*1024);const mime=imageType(image.bytes);preview.image=mime?`data:${mime};base64,${image.bytes.toString('base64')}`:null;}catch{preview.image=null;}}
   return preview.title||preview.image?preview:null;
  }catch{return null;}finally{busy--;}})();
  if(cache.size>=32)cache.delete(cache.keys().next().value);
  cache.set(url,{promise,expires:Date.now()+10*60*1000});return promise;
 }
 return async body=>{const urls=[...new Set(postLinks(body).map(x=>x.url))].slice(0,3);const results=[];for(const url of urls){const preview=await get(url);if(preview)results.push(preview);}return results;};
}
