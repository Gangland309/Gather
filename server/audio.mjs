import {randomUUID,randomBytes,createHash} from 'node:crypto';
import {mkdirSync,createReadStream} from 'node:fs';
import {open,rename,unlink,stat} from 'node:fs/promises';
import {resolve} from 'node:path';
import {parseFile} from 'music-metadata';
export const AUDIO_MAX_BYTES=200*1024*1024;
export function audioRange(value,size){
 if(!value)return {start:0,end:size-1,partial:false};
 const m=/^bytes=(\d*)-(\d*)$/.exec(value);if(!m||!m[1]&&!m[2])return null;
 let start=m[1]?Number(m[1]):Math.max(0,size-Number(m[2])),end=m[1]?(m[2]?Number(m[2]):size-1):size-1;
 if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start>=size||start<0||end<start||!m[1]&&Number(m[2])===0)return null;
 return {start,end:Math.min(end,size-1),partial:true};
}
export function createAudio({db,one,all,run,dataDir,requireThat,visiblePost,blocked,auth}){
 const dir=resolve(dataDir,'audio');mkdirSync(dir,{recursive:true});
 db.exec(`CREATE TABLE IF NOT EXISTS audio_uploads(id TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id),title TEXT NOT NULL,kind TEXT NOT NULL,filename TEXT NOT NULL,size INTEGER NOT NULL,duration REAL NOT NULL,created_at INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS audio_grants(hash TEXT PRIMARY KEY,audio_id TEXT NOT NULL REFERENCES audio_uploads(id) ON DELETE CASCADE,user_id TEXT NOT NULL,session_hash TEXT,expires_at INTEGER NOT NULL);`);
 if(!all('PRAGMA table_info(posts)').some(c=>c.name==='audio_id'))db.exec('ALTER TABLE posts ADD COLUMN audio_id TEXT REFERENCES audio_uploads(id)');
 if(!all('PRAGMA table_info(audio_uploads)').some(c=>c.name==='cover_id'))db.exec('ALTER TABLE audio_uploads ADD COLUMN cover_id TEXT REFERENCES uploads(id)');
 const hash=s=>createHash('sha256').update(s).digest('hex'),uploading=new Set();let count=0;
 function canView(id,viewer){const audio=one('SELECT * FROM audio_uploads WHERE id=?',id);if(!audio||blocked(audio.user_id,viewer))return null;if(viewer&&audio.user_id===viewer)return audio;return all('SELECT id FROM posts WHERE audio_id=? AND hidden=0',id).some(p=>{try{visiblePost(p.id,viewer);return true;}catch{return false;}})?audio:null;}
 function metadata(id,viewer,req){const a=canView(id,viewer);requireThat(a,404,'Audio not found.');run('DELETE FROM audio_grants WHERE expires_at<?',Date.now());const token=randomBytes(32).toString('base64url');const session=viewer?hash(req.headers.authorization.slice(7)):null;run('INSERT INTO audio_grants VALUES(?,?,?,?,?)',hash(token),id,viewer,session,Date.now()+24*3600000);const protocol=req.socket?.encrypted||(req.headers['x-forwarded-proto']||'').split(',')[0].trim()==='https'?'https':'http';const origin=new URL(process.env.PUBLIC_ORIGIN||`${protocol}://${req.headers.host}`).origin;return {id:a.id,title:a.title,kind:a.kind,duration:a.duration,size:a.size,coverUrl:a.cover_id?`${origin}/audio/${a.id}/cover?play=${token}`:null,url:`${origin}/audio/${a.id}.mp3?play=${token}`};}
 async function route(req,url,user){const path=url.pathname;
  if(req.method==='GET'&&/^\/api\/audio\/[a-f0-9-]+$/.test(path))return metadata(path.split('/').at(-1),user.id,req);
  if(req.method==='DELETE'&&/^\/api\/audio\/[a-f0-9-]+$/.test(path)){const id=path.split('/').at(-1),a=one('SELECT * FROM audio_uploads WHERE id=? AND user_id=?',id,user.id);requireThat(a,404,'Audio not found.');requireThat(!one('SELECT 1 FROM posts WHERE audio_id=?',id),409,'Remove its posts before deleting this audio.');run('DELETE FROM audio_uploads WHERE id=?',id);await unlink(resolve(dir,a.filename)).catch(()=>{});return {ok:true};}
  if(req.method==='PATCH'&&/^\/api\/audio\/[a-f0-9-]+\/cover$/.test(path)){const id=path.split('/')[3],a=one('SELECT * FROM audio_uploads WHERE id=? AND user_id=?',id,user.id);requireThat(a,404,'Audio not found.');requireThat(!one('SELECT 1 FROM posts WHERE audio_id=?',id),409,'Cover changes are only available before publishing.');const chunks=[];let size=0;for await(const c of req){size+=c.length;requireThat(size<4096,413,'Request too large.');chunks.push(c);}let input;try{input=JSON.parse(Buffer.concat(chunks).toString());}catch{requireThat(false,400,'Invalid cover request.');}const cover=input.coverId??null;requireThat(cover===null||typeof cover==='string'&&one('SELECT 1 FROM uploads WHERE id=? AND user_id=?',cover,user.id),400,'Your cover image was not found.');run('UPDATE audio_uploads SET cover_id=? WHERE id=?',cover,id);return {ok:true};}
  if(path!=='/api/audio'||req.method!=='POST')return;
  requireThat((req.headers['content-type']||'').split(';')[0]==='audio/mpeg',415,'Upload an MP3 file as audio/mpeg.');
  requireThat(url.searchParams.get('rights')==='true',400,'Confirm you own this audio or have permission to share it.');
  const title=(url.searchParams.get('title')||'').trim(),kind=url.searchParams.get('kind');requireThat(title.length>0&&title.length<=160&&!/[\u0000-\u001f]/.test(title),400,'Enter an audio title up to 160 characters.');requireThat(['music','audiobook'].includes(kind),400,'Choose Music or Audiobook.');
  const declared=Number(req.headers['content-length']);requireThat(!declared||Number.isSafeInteger(declared)&&declared<=AUDIO_MAX_BYTES&&declared>0,413,'MP3 files must be 200 MB or smaller.');
  requireThat(count<3&&!uploading.has(user.id),429,'An audio upload is already running. Try again shortly.');
  const usage=one('SELECT COUNT(*) n,COALESCE(SUM(size),0) bytes FROM audio_uploads WHERE user_id=? AND created_at>?',user.id,Date.now()-86400000);requireThat(usage.n<5&&usage.bytes+(declared||AUDIO_MAX_BYTES)<=512*1024*1024,429,'Audio upload limit reached: five files and 512 MB per day.');
  const cover=url.searchParams.get('coverId')||null;requireThat(!cover||one('SELECT 1 FROM uploads WHERE id=? AND user_id=?',cover,user.id),400,'Your cover image was not found.');
  const id=randomUUID(),temp=resolve(dir,id+'.part'),filename=id+'.mp3';let handle,total=0,saved=false;count++;uploading.add(user.id);
  try{for(const old of all('SELECT id,filename FROM audio_uploads a WHERE created_at<? AND NOT EXISTS(SELECT 1 FROM posts WHERE audio_id=a.id) LIMIT 50',Date.now()-86400000)){run('DELETE FROM audio_uploads WHERE id=?',old.id);await unlink(resolve(dir,old.filename)).catch(()=>{});}handle=await open(temp,'wx');req.setTimeout?.(600000);for await(const chunk of req){total+=chunk.length;requireThat(total<=AUDIO_MAX_BYTES,413,'MP3 files must be 200 MB or smaller.');await handle.writeFile(chunk);}await handle.close();handle=null;requireThat(total>0,400,'The audio file is empty.');
   let parsed;try{parsed=await parseFile(temp,{duration:true,skipCovers:true});}catch{requireThat(false,415,'This file is not a readable MP3. Export it as MP3 and try again.');}
   requireThat(/^MPEG.*Layer\s*3$/i.test(parsed.format.codec||'')&&Number.isFinite(parsed.format.duration)&&parsed.format.duration>0,415,'Choose a valid MP3 file. Other audio formats are not supported yet.');
   await rename(temp,resolve(dir,filename));try{run('INSERT INTO audio_uploads(id,user_id,title,kind,filename,size,duration,created_at,cover_id) VALUES(?,?,?,?,?,?,?,?,?)',id,user.id,title,kind,filename,total,parsed.format.duration,Date.now(),cover);saved=true;}catch(e){await unlink(resolve(dir,filename)).catch(()=>{});throw e;}
   return {id,title,kind,duration:parsed.format.duration,size:total};
  }finally{if(handle)await handle.close().catch(()=>{});if(!saved)await unlink(temp).catch(()=>{});count--;uploading.delete(user.id);}
 }
 async function stream(req,res,url){const match=/^\/audio\/([a-f0-9-]+)(\.mp3|\/cover)$/.exec(url.pathname);if(!match)return false;
  requireThat(['GET','HEAD'].includes(req.method),405,'Method not allowed.');const id=match[1],token=url.searchParams.get('play')||'';requireThat(/^[A-Za-z0-9_-]{43}$/.test(token),404,'Audio not found.');
  const grant=one('SELECT * FROM audio_grants WHERE hash=? AND audio_id=? AND expires_at>?',hash(token),id,Date.now());requireThat(grant,404,'Audio link expired. Reload the post.');
  if(grant.user_id){const session=one('SELECT u.* FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.hash=? AND s.user_id=? AND s.expires_at>? AND u.suspended=0',grant.session_hash,grant.user_id,Date.now());requireThat(session,404,'Audio session expired. Sign in again.');}
  const a=canView(id,grant.user_id);requireThat(a,404,'Audio not found.');const cover=match[2]==='/cover'?one('SELECT * FROM uploads WHERE id=?',a.cover_id):null;requireThat(match[2]!== '/cover'||cover,404,'Cover not found.');const file=cover?resolve(dataDir,'media',cover.filename):resolve(dir,a.filename),info=await stat(file),range=audioRange(req.headers.range,info.size);res.setHeader('Cache-Control','no-store');res.setHeader('Referrer-Policy','no-referrer');res.setHeader('Accept-Ranges','bytes');
  if(!range){res.writeHead(416,{'Content-Range':`bytes */${info.size}`});res.end();return true;}
  res.writeHead(range.partial?206:200,{'Content-Type':cover?cover.mime:'audio/mpeg','Content-Length':range.end-range.start+1,...(range.partial?{'Content-Range':`bytes ${range.start}-${range.end}/${info.size}`}:{})});
  if(req.method==='HEAD'){res.end();return true;}const source=createReadStream(file,{start:range.start,end:range.end});source.on('error',()=>res.destroy());res.on('close',()=>source.destroy());source.pipe(res);return true;
 }
 return {route,stream,metadata,canView};
}
