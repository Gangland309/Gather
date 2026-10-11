import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { spawn } from 'node:child_process';
process.env.NODE_ENV='test';
delete process.env.RESEND_API_KEY;
delete process.env.EMAIL_VERIFICATION_REQUIRED;
const data=mkdtempSync(join(tmpdir(),'gather-test-'));
process.env.DATA_DIR=data;
process.env.ADMIN_EMAIL='owner@example.test';
const {server}=await import('../server/server.mjs');
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base=`http://127.0.0.1:${server.address().port}`;
async function call(path,{token,method='GET',body,headers={}}={}) {
 const r=await fetch(`${base}/api${path}`,{method,headers:{...(token?{Authorization:`Bearer ${token}`} : {}),...(body!==undefined?{'Content-Type':'application/json'}:{}),...headers},...(body!==undefined?{body:JSON.stringify(body)}:{})});
 return {status:r.status,data:await r.json()};
}
const password='Different-password-2026!';
async function account(username,email=`${username}@example.test`){const r=await call('/auth/register',{method:'POST',body:{username,email,password,agreedRules:true,ageConfirmed:true,displayName:username.toUpperCase()}});assert.equal(r.status,200,JSON.stringify(r.data));return r.data;}
await test('real account-to-account API workflows and authorization',async t=>{
 const alice=await account('alice'),bob=await account('bob'),owner=await account('owner');
 const a=alice.token,b=bob.token,o=owner.token;
 await t.test('saved sessions remain valid after seven days and logout revokes them',async()=>{
  const person=await account('persistent_user');
  const clock=Date.now;Date.now=()=>clock()+30*86400000;
  try{assert.equal((await call('/me',{token:person.token})).status,200);assert.equal((await call('/auth/logout',{token:person.token,method:'POST'})).status,200);assert.equal((await call('/me',{token:person.token})).status,401);}finally{Date.now=clock;}
 });
 await t.test('authentication, validation and private endpoints',async()=>{
  assert.equal((await call('/health')).data.status,'ok');
  assert.equal((await call('/posts')).status,401);
  assert.equal((await call('/auth/login',{method:'POST',body:{email:'alice@example.test',password:'Wrong-password-2026!'}})).status,401);
  assert.equal((await call('/auth/login',{method:'POST',body:{email:'alice@example.test',password}})).status,200);
  assert.equal((await call('/auth/register',{method:'POST',body:{username:'bad name',email:'valid@example.test',password,displayName:'Bad'}})).status,400);
  assert.equal((await call('/auth/register',{method:'POST',body:{username:'alice',email:'fresh@example.test',password,displayName:'Duplicate',agreedRules:true,ageConfirmed:true}})).status,409);
  const me=await call('/me',{token:a});assert.equal(me.data.email,undefined);assert.equal(me.data.password_hash,undefined);
  assert.equal((await call('/me',{token:o})).data.isAdmin,true);
  assert.equal((await call('/me',{token:a,headers:{Origin:'https://evil.example'}})).status,403);
 });
 let postId;
 await t.test('posts persist, content is validated and deletion enforces ownership',async()=>{
  assert.equal((await call('/posts',{token:a,method:'POST',body:{body:''}})).status,400);
  assert.equal((await call('/posts',{token:a,method:'POST',body:{body:'x'.repeat(2001)}})).status,400);
  const post=await call('/posts',{token:a,method:'POST',body:{body:"First real post! ' OR 1=1 --"}});assert.equal(post.status,200);postId=post.data.id;
  const feed=await call('/posts',{token:b});assert.equal(feed.data.posts[0].id,postId);assert.equal(feed.data.posts[0].body,"First real post! ' OR 1=1 --");
  assert.equal((await call(`/posts/${postId}`,{token:b,method:'DELETE'})).status,403);
 });
 await t.test('link previews enforce post visibility and reject local-network links',async()=>{
  const created=await call('/posts',{token:a,method:'POST',body:{body:'http://127.0.0.1/private',audience:'self'}});
  assert.equal(created.status,200);
  assert.equal((await call(`/posts/${created.data.id}/link-previews`,{token:b})).status,404);
  assert.deepEqual((await call(`/posts/${created.data.id}/link-previews`,{token:a})).data,{previews:[]});
  assert.equal((await call(`/posts/${created.data.id}/link-previews`)).status,401);
  await call(`/posts/${created.data.id}`,{token:a,method:'DELETE'});
 });
 await t.test('following feed, idempotent likes, comments and activity',async()=>{
  assert.equal((await call('/posts?following=true',{token:b})).data.posts.length,0);
  await call(`/users/${alice.user.id}/follow`,{token:b,method:'PUT'});
  await call(`/users/${alice.user.id}/follow`,{token:b,method:'PUT'});
  assert.equal((await call('/posts?following=true',{token:b})).data.posts.length,1);
  const first=await call(`/posts/${postId}/like`,{token:b,method:'PUT'});assert.equal(first.data.likeCount,1);
  const repeat=await call(`/posts/${postId}/like`,{token:b,method:'PUT'});assert.equal(repeat.data.likeCount,1);
  assert.equal((await call(`/posts/${postId}/comments`,{token:b,method:'POST',body:{body:'Good to be here.'}})).status,200);
  assert.equal((await call(`/posts/${postId}/comments`,{token:a})).data[0].body,'Good to be here.');
  const notifications=await call('/notifications',{token:a});assert.equal(notifications.data.length,3);
  await call('/notifications/read',{token:a,method:'POST'});
  assert.ok((await call('/notifications',{token:a})).data.every(n=>n.seen));
 });
 await t.test('profiles and people search',async()=>{
  const edited=await call('/me',{token:a,method:'PATCH',body:{displayName:'Alice Example',bio:'Making a new community.'}});assert.equal(edited.data.bio,'Making a new community.');
  const search=await call('/users?q=Alice%20Example',{token:b});assert.equal(search.data[0].id,alice.user.id);assert.equal(search.data[0].isFollowing,true);
 });
 await t.test('bidirectional blocking, interactions, comments and notifications',async()=>{
  assert.equal((await call(`/users/${alice.user.id}/block`,{token:a,method:'PUT'})).status,400);
  await call(`/users/${bob.user.id}/block`,{token:a,method:'PUT'});
  assert.equal((await call('/posts',{token:b})).data.posts.length,0);
  assert.equal((await call(`/posts/${postId}/comments`,{token:b})).status,404);
  assert.equal((await call(`/users/${alice.user.id}/follow`,{token:b,method:'PUT'})).status,404);
  assert.equal((await call('/users?q=alice',{token:b})).data.length,0);
  assert.equal((await call(`/posts/${postId}/comments`,{token:a})).data.length,0);
  assert.equal((await call('/notifications',{token:a})).data.length,0);
  assert.equal((await call('/posts',{token:a})).data.posts[0].likeCount,0);
  await call(`/users/${bob.user.id}/block`,{token:a,method:'DELETE'});
  assert.equal((await call('/posts',{token:b})).data.posts.length,1);
  assert.equal((await call(`/users/${alice.user.id}`,{token:b})).data.isFollowing,false);
 });
 let photoId,mediaUrl;
 await t.test('real photo upload rejects other formats and prevents upload theft',async()=>{
  assert.equal((await call('/uploads',{token:a,method:'POST',body:{base64:Buffer.from('<script>alert(1)</script>').toString('base64')}})).status,400);
  // Valid 1x1 PNG.
  const uploaded=await call('/uploads',{token:a,method:'POST',body:{base64:'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/a9sAAAAASUVORK5CYII='}});assert.equal(uploaded.status,200);photoId=uploaded.data.id;mediaUrl=uploaded.data.url;
  assert.equal((await fetch(`${base}${mediaUrl}`,{headers:{Authorization:`Bearer ${a}`}})).status,200);
  assert.equal((await call('/posts',{token:b,method:'POST',body:{body:'Steal photo',mediaId:photoId}})).status,400);
  const photo=await call('/posts',{token:a,method:'POST',body:{body:'Photo',mediaId:photoId}});assert.equal(photo.status,200);photoId=photo.data.id;
  const media=await fetch(`${base}${mediaUrl}`,{headers:{Authorization:`Bearer ${a}`}});assert.equal(media.status,200);assert.equal(media.headers.get('content-type'),'image/png');assert.equal((await media.arrayBuffer()).byteLength,68);
 });
 await t.test('report queue requires administrator and hidden media is unavailable',async()=>{
  assert.equal((await call('/admin/reports',{token:b})).status,403);
  await call(`/posts/${photoId}/report`,{token:b,method:'POST',body:{reason:'Please review this photo.'}});
  await call(`/posts/${photoId}/report`,{token:b,method:'POST',body:{reason:'Duplicate report.'}});
  const queue=await call('/admin/reports',{token:o});assert.equal(queue.data.length,1);
  const reportId=queue.data[0].id;
  assert.equal((await call(`/admin/reports/${reportId}`,{token:b,method:'PATCH',body:{hidePost:true}})).status,403);
  assert.equal((await call(`/admin/reports/${reportId}`,{token:o,method:'PATCH',body:{hidePost:true}})).status,200);
  assert.equal((await call('/admin/reports',{token:o})).data.length,0);
  assert.ok((await call('/posts',{token:a})).data.posts.every(p=>p.id!==photoId));
  assert.equal((await fetch(`${base}${mediaUrl}`,{headers:{Authorization:`Bearer ${b}`}})).status,404);
 });
 await t.test('on-disk credentials contain hashes, not password or session secrets',async()=>{
  const disk=new DatabaseSync(join(data,'gather.sqlite'));
  const u=disk.prepare('SELECT * FROM users WHERE id=?').get(alice.user.id);
  assert.notEqual(u.password_hash,password);assert.equal(u.password_hash.length,128);assert.equal(u.salt.length,32);
  assert.ok(disk.prepare('SELECT hash FROM sessions').all().every(s=>s.hash.length===64&&s.hash!==a));
  disk.close();
 });
 await t.test('cursor pagination and logout invalidates a session',async()=>{
  for(let i=0;i<23;i++)await call('/posts',{token:a,method:'POST',body:{body:`Pagination ${i}`}});
  const first=(await call('/posts',{token:a})).data;assert.equal(first.posts.length,20);assert.ok(first.nextCursor);
  const second=(await call(`/posts?before=${first.nextCursor}`,{token:a})).data;assert.equal(second.posts.length,4);
  assert.ok(second.posts.every(p=>p.id<first.nextCursor));
  assert.equal((await call('/posts?before=NaN',{token:a})).status,400);
  await call('/auth/logout',{token:b,method:'POST'});
  assert.equal((await call('/me',{token:b})).status,401);
 });
});
await new Promise(resolve=>server.close(resolve));
await test('a new backend process can read existing database records after restart',async()=>{
 const moduleUrl=new URL('../server/server.mjs',import.meta.url).href;
 const child=spawn(process.execPath,['--input-type=module','-e',`import {server} from ${JSON.stringify(moduleUrl)};server.listen(0,'127.0.0.1',()=>console.log(server.address().port));`],{env:process.env,stdio:['ignore','pipe','pipe']});
 let log='';const timer=setTimeout(()=>child.kill(),10000);
 try {
  const port=await new Promise((resolve,reject)=>{child.stdout.on('data',chunk=>{log+=chunk;const match=/^(\d+)$/m.exec(log);if(match)resolve(Number(match[1]));});child.once('exit',()=>reject(new Error('Restart process exited before listening.')));child.once('error',reject);});
  const signed=await fetch(`http://127.0.0.1:${port}/api/auth/login`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'alice@example.test',password})});assert.equal(signed.status,200);
  const session=await signed.json();const response=await fetch(`http://127.0.0.1:${port}/api/posts`,{headers:{Authorization:`Bearer ${session.token}`}});const feed=await response.json();assert.equal(feed.posts.length,20);assert.equal(feed.posts[0].body,'Pagination 22');
 }finally{clearTimeout(timer);child.kill('SIGTERM');await new Promise(resolve=>child.once('exit',resolve));}
});
rmSync(data,{recursive:true,force:true});
