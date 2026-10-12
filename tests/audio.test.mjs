import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync,readFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {request} from 'node:http';
import {audioRange} from '../server/audio.mjs';
process.env.NODE_ENV='test';process.env.EMAIL_VERIFICATION_REQUIRED='false';delete process.env.PUBLIC_ORIGIN;
const dir=mkdtempSync(join(tmpdir(),'gather-audio-'));process.env.DATA_DIR=dir;const {server}=await import('../server/server.mjs');await new Promise(r=>server.listen(0,'127.0.0.1',r));const base=`http://127.0.0.1:${server.address().port}`,mp3=readFileSync(new URL('./fixtures/tone.mp3',import.meta.url));
async function api(path,token,method='GET',body){const r=await fetch(base+'/api'+path,{method,headers:{...(token?{Authorization:`Bearer ${token}`} : {}),...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{})});return {status:r.status,data:await r.json()};}
async function account(name){return (await api('/auth/register',null,'POST',{username:name,email:name+'@example.test',displayName:name,password:'Audio-test-password-2026!',agreedRules:true,ageConfirmed:true})).data;}
async function upload(token,body=mp3,query='title=Test%20book&kind=audiobook&rights=true',mime='audio/mpeg'){const r=await fetch(base+'/api/audio?'+query,{method:'POST',headers:{...(token?{Authorization:`Bearer ${token}`} : {}),'Content-Type':mime},body});return {status:r.status,data:await r.json()};}
try{
 const alice=await account('audio_alice'),bob=await account('audio_bob'),bad=await account('audio_bad');let audio,post,link;
 await test('MP3 upload requires login, rights confirmation and valid MP3 bytes',async()=>{
  assert.equal((await upload(null)).status,401);
  assert.equal((await upload(bad.token,mp3,'title=Test&kind=music')).status,400);
  assert.equal((await upload(bad.token,Buffer.from('<html>not audio</html>'))).status,415);
  assert.equal((await upload(bad.token,mp3,undefined,'text/html')).status,415);
  const r=await upload(alice.token);assert.equal(r.status,200,JSON.stringify(r.data));audio=r.data;assert.ok(audio.duration>1);assert.equal(audio.kind,'audiobook');assert.equal(audio.size,mp3.length);
 });
 await test('only the uploader can preview or attach an unpublished MP3; mixed media is rejected',async()=>{
  assert.equal((await api('/audio/'+audio.id,bob.token)).status,404);
  assert.equal((await api('/posts',bob.token,'POST',{audioId:audio.id,audience:'public'})).status,400);
  assert.equal((await api('/posts',alice.token,'POST',{audioId:audio.id,videoId:'x'})).status,400);
  const r=await api('/posts',alice.token,'POST',{audioId:audio.id,audience:'self',body:''});assert.equal(r.status,200,JSON.stringify(r.data));post=r.data;assert.equal(post.audioId,audio.id);assert.equal(post.body,'');
 });
 await test('private audio is protected in metadata and direct byte access',async()=>{
  assert.equal((await api('/public/audio/'+audio.id)).status,404);
  assert.equal((await api('/audio/'+audio.id,bob.token)).status,404);
  assert.equal((await fetch(base+'/audio/'+audio.id+'.mp3')).status,404);
  link=(await api('/audio/'+audio.id,alice.token)).data.url;assert.equal((await fetch(link)).status,200);
 });
 await test('MP3 byte-range and HEAD streaming support seek without leaking extra bytes',async()=>{
  const r=await fetch(link,{headers:{Range:'bytes=10-39'}});assert.equal(r.status,206);assert.equal(r.headers.get('content-range'),`bytes 10-39/${mp3.length}`);assert.deepEqual(Buffer.from(await r.arrayBuffer()),mp3.subarray(10,40));
  const head=await fetch(link,{method:'HEAD'});assert.equal(head.status,200);assert.equal(Number(head.headers.get('content-length')),mp3.length);assert.equal((await head.arrayBuffer()).byteLength,0);
  assert.equal((await fetch(link,{headers:{Range:'bytes=999999-'}})).status,416);
 });
 await test('published audio cannot be deleted out from under a post; audio-only captions can be edited',async()=>{
  assert.equal((await api('/audio/'+audio.id,alice.token,'DELETE')).status,409);
  assert.equal((await api('/posts/'+post.id,alice.token,'PATCH',{body:''})).status,200);
 });
 await test('signed audio links stop working after logout',async()=>{
  await api('/auth/logout',alice.token,'POST');assert.equal((await fetch(link)).status,404);
 });
 await test('public audio can be shared, then deleting the post hides both metadata and existing playback links',async()=>{
  const r=await upload(bob.token);assert.equal(r.status,200);const p=await api('/posts',bob.token,'POST',{audioId:r.data.id,audience:'public',confirmPublic:true,body:''});assert.equal(p.status,200);const info=await api('/public/audio/'+r.data.id);assert.equal(info.status,200);assert.equal((await fetch(info.data.url)).status,200);
  await api('/posts/'+p.data.id,bob.token,'DELETE');assert.equal((await api('/public/audio/'+r.data.id)).status,404);assert.equal((await fetch(info.data.url)).status,404);
 });
 await test('unposted audio can be removed only by its owner',async()=>{
  const r=await upload(bob.token);assert.equal(r.status,200);assert.equal((await api('/audio/'+r.data.id,bad.token,'DELETE')).status,404);assert.equal((await api('/audio/'+r.data.id,bob.token,'DELETE')).status,200);assert.equal((await api('/audio/'+r.data.id,bob.token)).status,404);
 });
 await test('oversized upload is rejected before reading its body; upload attempts have a daily cap',async()=>{
  const q=await account('audio_limits');const status=await new Promise(resolve=>{const req=request(base+'/api/audio?title=Big&kind=music&rights=true',{method:'POST',headers:{Authorization:'Bearer '+q.token,'Content-Type':'audio/mpeg','Content-Length':200*1024*1024+1}},res=>{res.resume();res.on('end',()=>resolve(res.statusCode));});req.on('error',()=>resolve(0));req.end();});assert.equal(status,413);
  for(let i=0;i<4;i++)assert.equal((await upload(q.token)).status,200);
  assert.equal((await upload(q.token)).status,429);
 });
 await test('range parser accepts suffix/open ranges and rejects multi-range and invalid bounds',()=>{
  assert.deepEqual(audioRange('bytes=-5',10),{start:5,end:9,partial:true});assert.deepEqual(audioRange('bytes=7-',10),{start:7,end:9,partial:true});assert.deepEqual(audioRange('bytes=2-999',10),{start:2,end:9,partial:true});for(const h of ['bytes=5-2','bytes=-0','bytes=1-2,4-5','bytes=999-','bytes=-','bytes=9007199254740992-'])assert.equal(audioRange(h,10),null);
 });
}finally{await new Promise(r=>server.close(r));rmSync(dir,{recursive:true,force:true});}
