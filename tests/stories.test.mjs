import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {DatabaseSync} from 'node:sqlite';
import {generateKeyPairSync} from 'node:crypto';
process.env.NODE_ENV='test';process.env.DATA_DIR=mkdtempSync(join(tmpdir(),'gather-moments-'));delete process.env.EMAIL_VERIFICATION_REQUIRED;delete process.env.RESEND_API_KEY;
const {server}=await import('../server/server.mjs');await new Promise(r=>server.listen(0,'127.0.0.1',r));const base=`http://127.0.0.1:${server.address().port}`,db=new DatabaseSync(join(process.env.DATA_DIR,'gather.sqlite'));
async function call(path,user,method='GET',body){const r=await fetch(base+'/api'+path,{method,headers:{...(user?{Authorization:`Bearer ${user.token}`} : {}),...(body!==undefined?{'Content-Type':'application/json'}:{})},...(body!==undefined?{body:JSON.stringify(body)}:{})});return {status:r.status,data:await r.json()};}
async function account(username){return (await call('/auth/register',null,'POST',{username,email:username+'@example.test',displayName:username,password:'Strong-password-2026!',ageConfirmed:true,agreedRules:true})).data;}
const a=await account('momentalice'),b=await account('momentbob'),c=await account('momentcarol');
try {
await test('Moments enforce explicit public consent, friendship, privacy and blocks',async()=>{
 assert.equal((await call('/stories')).status,401);assert.equal((await call('/stories',a,'POST',{body:'Hello',audience:'public'})).status,400);
 const friends=(await call('/stories',a,'POST',{body:'Friends'})).data;
 assert.equal((await call(`/stories/${friends.id}`,b)).status,404);
 await call(`/users/${a.user.id}/follow`,b,'PUT');assert.equal((await call(`/stories/${friends.id}`,b)).status,404);
 await call(`/users/${b.user.id}/follow`,a,'PUT');assert.equal((await call(`/stories/${friends.id}`,b)).status,200);
 const pub=(await call('/stories',a,'POST',{body:'Public',audience:'public',confirmPublic:true})).data;assert.equal((await call(`/stories/${pub.id}`,c)).status,200);
 await call('/account',a,'PATCH',{isPrivate:true});assert.equal((await call(`/stories/${pub.id}`,c)).status,404);assert.equal((await call(`/stories/${pub.id}`,b)).status,200);
 await call(`/users/${b.user.id}/block`,a,'PUT');assert.equal((await call(`/stories/${pub.id}`,b)).status,404);assert.equal((await call('/stories',b)).data.length,0);await call(`/users/${b.user.id}/block`,a,'DELETE');await call('/account',a,'PATCH',{isPrivate:false});
});
await test('Moments views are idempotent; expiry and ownership are enforced',async()=>{
 const s=(await call('/stories',a,'POST',{body:'View me',audience:'public',confirmPublic:true})).data;
 assert.ok(Math.abs(s.expiresAt-Date.now()-86400000)<3000);
 await call(`/stories/${s.id}/view`,b,'POST',{});await call(`/stories/${s.id}/view`,b,'POST',{});await call(`/stories/${s.id}/view`,a,'POST',{});
 assert.equal((await call(`/stories/${s.id}`,a)).data.viewCount,1);assert.equal((await call(`/stories/${s.id}`,b)).data.viewCount,undefined);assert.equal((await call(`/stories/${s.id}`,b)).data.seen,true);
 assert.equal((await call(`/stories/${s.id}`,b,'DELETE')).status,403);assert.equal((await call(`/stories/${s.id}`,a,'DELETE')).status,200);assert.equal(db.prepare('SELECT COUNT(*) n FROM story_views WHERE story_id=?').get(s.id).n,0);
 const exp=(await call('/stories',a,'POST',{body:'Expire',audience:'public',confirmPublic:true})).data;db.prepare('UPDATE stories SET expires_at=0 WHERE id=?').run(exp.id);assert.equal((await call(`/stories/${exp.id}`,a)).status,404);assert.equal((await call(`/stories/${exp.id}/view`,b,'POST',{})).status,404);assert.ok(!(await call('/stories',b)).data.some(s=>s.id===exp.id));
});
await test('Moments photo URLs cannot bypass friendship or expiry restrictions',async()=>{
 const photo=(await call('/uploads',a,'POST',{base64:'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aL7sAAAAASUVORK5CYII='})).data;
 assert.equal((await call('/stories',b,'POST',{mediaId:photo.id})).status,400);
 const s=(await call('/stories',a,'POST',{mediaId:photo.id,audience:'public',confirmPublic:true})).data;
 assert.equal((await fetch(base+s.mediaUrl,{headers:{Authorization:`Bearer ${b.token}`}})).status,200);assert.equal((await fetch(base+s.mediaUrl)).status,404);
 db.prepare('UPDATE stories SET expires_at=0 WHERE id=?').run(s.id);assert.equal((await fetch(base+s.mediaUrl,{headers:{Authorization:`Bearer ${b.token}`}})).status,404);
});
await test('Moments video playback respects access and the 60-second duration limit',async()=>{
 const key=generateKeyPairSync('rsa',{modulusLength:2048});process.env.MUX_SIGNING_KEY_ID='test';process.env.MUX_SIGNING_PRIVATE_KEY=key.privateKey.export({type:'pkcs8',format:'pem'});
 db.prepare("INSERT INTO videos(id,user_id,upload_id,status,created_at,duration,playback_id) VALUES(?,?,'','ready',?,?,'test')").run('moment-video',a.user.id,new Date().toISOString(),61);
 assert.equal((await call('/stories',a,'POST',{videoId:'moment-video'})).status,400);db.prepare('UPDATE videos SET duration=60 WHERE id=?').run('moment-video');
 assert.equal((await call('/stories',b,'POST',{videoId:'moment-video'})).status,400);
 const s=(await call('/stories',a,'POST',{videoId:'moment-video',audience:'public',confirmPublic:true})).data;assert.equal((await call('/videos/moment-video',b)).status,200);db.prepare('UPDATE stories SET expires_at=0 WHERE id=?').run(s.id);assert.equal((await call('/videos/moment-video',b)).status,404);
});
}finally{await new Promise(r=>server.close(r));db.close();rmSync(process.env.DATA_DIR,{recursive:true,force:true});}
