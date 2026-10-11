import test from 'node:test';
import assert from 'node:assert/strict';
import {extractPreview,previewURL,publicAddress,createLinkPreviews} from '../server/link-previews.mjs';
test('extracts social thumbnail, title and description regardless of attribute order',()=>{
 const p=extractPreview(`<title>Fallback</title><meta content="Garden &amp; Grow" property="og:title"><meta name='description' content='A garden guide.'><meta property='og:image' content='/cover.png'>`,'https://example.com/article');
 assert.equal(p.title,'Garden & Grow');assert.equal(p.image,'https://example.com/cover.png');assert.equal(p.description,'A garden guide.');
});
test('Twitter tags and normal title are supported; unsafe images are excluded',()=>{
 assert.equal(extractPreview('<title>Plain title</title>','https://example.com').title,'Plain title');
 const p=extractPreview('<meta name="twitter:title" content="A title"><meta name="twitter:image" content="javascript:bad">','https://example.com');assert.equal(p.title,'A title');assert.equal(p.image,null);
});
test('blocks private, loopback, metadata, credentials and alternate protocols',()=>{
 for(const ip of ['127.0.0.1','10.1.2.3','169.254.169.254','172.16.0.1','192.168.1.1','100.64.1.1','0.0.0.0','224.0.0.1','::1','::ffff:127.0.0.1'])assert.equal(publicAddress(ip),false,ip);
 assert.equal(publicAddress('8.8.8.8'),true);
 for(const url of ['http://127.0.0.1','http://2130706433','http://localhost','https://user:pass@example.com','file:///etc/passwd','http://example.com:8080'])assert.throws(()=>previewURL(url));
});
test('downloads thumbnails once, deduplicates links and caches successful previews',async()=>{
 let count=0;const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/a9sAAAAASUVORK5CYII=','base64');
 const preview=createLinkPreviews({download:async url=>{count++;return url.endsWith('.png')?{bytes:png,headers:{},url}:{bytes:Buffer.from('<meta property="og:title" content="Example"><meta property="og:image" content="/cover.png">'),headers:{'content-type':'text/html'},url};}});
 const first=await preview('https://example.com https://example.com');assert.equal(first.length,1);assert.ok(first[0].image.startsWith('data:image/png;base64,'));await preview('https://example.com');assert.equal(count,2);
});
test('image failure retains title and full metadata failure leaves ordinary link alone',async()=>{
 const get=createLinkPreviews({download:async url=>{if(url.endsWith('.png'))throw new Error('blocked');return {bytes:Buffer.from('<title>Example</title><meta property="og:image" content="/x.png">'),headers:{'content-type':'text/html'},url};}});
 assert.equal((await get('https://example.com'))[0].image,null);
 const failure=createLinkPreviews({download:async()=>{throw new Error('offline');}});assert.deepEqual(await failure('https://example.com'),[]);
});
