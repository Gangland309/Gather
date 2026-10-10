import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {DatabaseSync} from 'node:sqlite';
process.env.NODE_ENV='test';
process.env.DATA_DIR=mkdtempSync(join(tmpdir(),'gather-features-'));
process.env.PUBLIC_ORIGIN='https://gatherourworld.com';
process.env.EMAIL_FROM='Gather <no-reply@mail.gatherourworld.com>';
process.env.EMAIL_VERIFICATION_REQUIRED='true';
process.env.ADMIN_EMAIL='owner@example.test';
const mail=[];
let failMail=false;
const {setTestMailTransport}=await import('../server/email.mjs');
setTestMailTransport(async message=>{if(failMail)throw new Error('Simulated failure');mail.push(message);});
const {server}=await import('../server/server.mjs');
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const base=`http://127.0.0.1:${server.address().port}`;
const database=new DatabaseSync(join(process.env.DATA_DIR,'gather.sqlite'));
const password='A-strong-password-2026!';
async function call(path,token,body,method=body===undefined?'GET':'POST') {
 const r=await fetch(`${base}/api${path}`,{method,headers:{...(token?{Authorization:`Bearer ${token}`} : {}),...(body!==undefined?{'Content-Type':'application/json'}:{})},...(body!==undefined?{body:JSON.stringify(body)}:{})});
 return {status:r.status,data:await r.json()};
}
function action(email,kind){const m=mail.filter(m=>m.to[0]===email && m.subject.includes(kind==='verify'?'Verify':'Reset')).at(-1);assert.ok(m);return new URLSearchParams(new URL(m.text.split('\n')[2]).hash.slice(1)).get('token');}
async function account(name,verified=true){const r=await call('/auth/register',null,{email:`${name}@example.test`,username:name,displayName:name,password,agreedRules:true,ageConfirmed:true});assert.equal(r.status,200,JSON.stringify(r.data));if(verified)assert.equal((await call('/auth/verify-email',null,{token:action(`${name}@example.test`,'verify')})).status,200);return r.data;}
try {
 await test('verification, hashed single-use tokens, and recovery',async t=>{
  const alice=await account('alice',false),a=alice.token;
  const token=action('alice@example.test','verify');
  await t.test('unverified accounts cannot publish or obtain admin access',async()=>{
   assert.equal(alice.user.emailVerified,false);
   assert.equal((await call('/posts',a,{body:'Before verification'})).status,403);
   assert.equal((await call('/auth/verify-email',null,{token:'bad'})).status,400);
   assert.ok(database.prepare('SELECT * FROM email_actions').all().every(v=>v.hash!==token&&v.hash.length===64));
   assert.equal((await call('/auth/verify-email',null,{token})).status,200);
   assert.equal((await call('/auth/verify-email',null,{token})).status,400);
   assert.equal((await call('/me',a)).data.emailVerified,true);
  });
  await t.test('expired verification is rejected and resend is throttled',async()=>{
   const stale=await account('stale',false),expired=action('stale@example.test','verify');
   database.prepare("UPDATE email_actions SET expires_at=0 WHERE user_id=?").run(stale.user.id);
   assert.equal((await call('/auth/verify-email',null,{token:expired})).status,400);
   assert.equal((await call('/auth/resend-verification',stale.token,{})).status,503);
   database.prepare("UPDATE email_limits SET last_sent=0 WHERE email=?").run('stale@example.test');
   assert.equal((await call('/auth/resend-verification',stale.token,{})).status,200);
  });
  await t.test('reset is generic, validates the password and revokes sessions',async()=>{
   const known=await call('/auth/forgot-password',null,{email:'alice@example.test'}),unknown=await call('/auth/forgot-password',null,{email:'unknown@example.test'});
   assert.deepEqual(known,unknown);
   const reset=action('alice@example.test','reset');
   assert.equal((await call('/auth/reset-password',null,{token:reset,password:'short'})).status,400);
   const next='A-new-strong-password-2026!';
   const results=await Promise.all([call('/auth/reset-password',null,{token:reset,password:next}),call('/auth/reset-password',null,{token:reset,password:next})]);
   assert.deepEqual(results.map(r=>r.status).sort(),[200,400]);
   assert.equal((await call('/me',a)).status,401);
   assert.equal((await call('/auth/login',null,{email:'alice@example.test',password})).status,401);
   assert.equal((await call('/auth/login',null,{email:'alice@example.test',password:next})).status,200);
  });
  await t.test('provider failures do not expose action tokens',async()=>{
   failMail=true;const failed=await account('failed',false);failMail=false;
   assert.equal(failed.emailSent,false);
   assert.equal(database.prepare('SELECT COUNT(*) n FROM email_actions WHERE user_id=?').get(failed.user.id).n,0);
  });
 });
 await test('profile pictures, reposts, sharing permissions and moderation',async t=>{
  const bob=await account('bob'),carol=await account('carol'),owner=await account('owner'),dana=await account('dana');
  const b=bob.token,c=carol.token,o=owner.token;
  const uploaded=await call('/uploads',b,{base64:'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aC+0AAAAASUVORK5CYII='});
  await t.test('avatar upload belongs to its owner; media requires authentication',async()=>{
   assert.equal((await call('/me/avatar',c,{mediaId:uploaded.data.id},'PUT')).status,400);
   const result=await call('/me/avatar',b,{mediaId:uploaded.data.id},'PUT');assert.equal(result.status,200);assert.equal(result.data.avatarUrl,uploaded.data.url);
   assert.equal((await fetch(base+uploaded.data.url)).status,200);
   assert.equal((await fetch(base+uploaded.data.url,{headers:{Authorization:`Bearer ${c}`}})).status,200);
   await call(`/users/${carol.user.id}/block`,b,{},'PUT');
   assert.equal((await fetch(base+uploaded.data.url,{headers:{Authorization:`Bearer ${c}`}})).status,404);
   await call(`/users/${carol.user.id}/block`,b,undefined,'DELETE');
  });
  const original=(await call('/posts',b,{body:'An original post'})).data;
  const repost=(await call(`/posts/${original.id}/repost`,c,{body:'Worth sharing'})).data;
  await t.test('reposts credit original and remain idempotent',async()=>{
   assert.equal(repost.original.id,original.id);assert.equal(repost.original.author.id,bob.user.id);
   assert.equal((await call(`/posts/${original.id}/repost`,c,{})).data.id,repost.id);
   assert.equal((await call(`/posts/${repost.id}`,null)).status,401);
   assert.equal((await call(`/posts/${repost.id}`,dana.token)).data.original.body,'An original post');
   await call(`/users/${dana.user.id}/block`,b,{},'PUT');
   assert.equal((await call(`/posts/${repost.id}`,dana.token)).status,404);
   assert.ok(!(await call('/posts',dana.token)).data.posts.some(p=>p.id===repost.id));
  });
  await t.test('hiding original hides its repost and deleting original cascades',async()=>{
   await call(`/posts/${original.id}/report`,c,{reason:'Moderation test'});
   const reports=(await call('/admin/reports',o)).data;
   await call(`/admin/reports/${reports[0].id}`,o,{hidePost:true},'PATCH');
   assert.equal((await call(`/posts/${repost.id}`,c)).status,404);
   database.prepare('UPDATE posts SET hidden=0 WHERE id=?').run(original.id);
   assert.equal((await call(`/posts/${original.id}`,b,undefined,'DELETE')).status,200);
   assert.equal((await call(`/posts/${repost.id}`,c)).status,404);
  });
 });
 await test('message request workflow and private reporting',async t=>{
  const sender=await account('sender'),recipient=await account('recipient'),outsider=await account('outsider');
  const a=sender.token,b=recipient.token,x=outsider.token;
  const c=(await call('/conversations',a,{userId:recipient.user.id,body:'Hello from a stranger'})).data;
  await t.test('requests allow one initial message and only recipient can accept',async()=>{
   assert.equal(c.status,'pending');assert.equal(c.incoming,false);
   const inbox=(await call('/conversations',b)).data;assert.equal(inbox[0].incoming,true);assert.equal(inbox[0].unread,1);
   assert.equal((await call(`/conversations/${c.id}/messages`,x)).status,404);
   assert.equal((await call(`/conversations/${c.id}/messages`,a,{body:'Another request'})).status,403);
   assert.equal((await call(`/conversations/${c.id}/decision`,a,{action:'accept'})).status,403);
   assert.equal((await call(`/conversations/${c.id}/decision`,b,{action:'accept'})).status,200);
   assert.equal((await call(`/conversations/${c.id}/messages`,b,{body:'Welcome'})).status,200);
  });
  await t.test('messages, unread counts, pagination, and reports enforce membership',async()=>{
   const messages=(await call(`/conversations/${c.id}/messages`,a)).data;
   assert.equal(messages.messages.length,2);
   assert.equal((await call(`/conversations/${c.id}/messages?before=${messages.messages[1].id}`,a)).data.messages.length,1);
   assert.equal((await call(`/conversations/${c.id}/messages?before=bad`,a)).status,400);
   await call(`/conversations/${c.id}/read`,a,{});
   assert.equal((await call('/conversations',a)).data[0].unread,0);
   assert.equal((await call('/reports',x,{kind:'message',targetId:String(messages.messages[0].id),reason:'Not my conversation'})).status,404);
   assert.equal((await call('/reports',b,{kind:'message',targetId:String(messages.messages[0].id),reason:'Review this message'})).status,200);
   assert.equal((await call('/admin/cases',b)).status,403);
  });
  await t.test('blocking hides both inboxes and denies reads and writes',async()=>{
   await call(`/users/${sender.user.id}/block`,b,{},'PUT');
   assert.equal((await call('/conversations',a)).data.length,0);
   assert.equal((await call('/conversations',b)).data.length,0);
   assert.equal((await call(`/conversations/${c.id}/messages`,a)).status,404);
   assert.equal((await call(`/conversations/${c.id}/messages`,b,{body:'Blocked'})).status,404);
  });
  await t.test('following bypasses requests; decline prevents repeated contact',async()=>{
   await call(`/users/${recipient.user.id}/follow`,x,{},'PUT');
   const direct=(await call('/conversations',b,{userId:outsider.user.id,body:'You follow me'})).data;assert.equal(direct.status,'accepted');
   const request=(await call('/conversations',a,{userId:outsider.user.id,body:'A new request'})).data;assert.equal(request.status,'pending');
   await call(`/conversations/${request.id}/decision`,x,{action:'decline'});
   assert.equal((await call('/conversations',a,{userId:outsider.user.id,body:'Retry'})).status,403);
   assert.equal((await call(`/conversations/${request.id}/messages`,a)).status,404);
  });
  await t.test('profile reports and support requests reach admin queue',async()=>{
   assert.equal((await call('/reports',x,{kind:'profile',targetId:recipient.user.id,reason:'Profile report'})).status,200);
   assert.equal((await call('/support',x,{body:'Please review my privacy request.'})).status,200);
   const owner=(await call('/auth/login',null,{email:'owner@example.test',password})).data;
   const queue=(await call('/admin/cases',owner.token)).data;
   assert.ok(queue.some(c=>c.kind==='profile'));assert.ok(queue.some(c=>c.kind==='support'));assert.ok(queue.some(c=>c.content==='Hello from a stranger'));
   assert.equal((await call(`/admin/cases/${queue[0].id}`,owner.token,{resolved:true,reply:'We received your request.'},'PATCH')).status,200);
   const own=(await call('/support',x)).data;assert.ok(own.some(t=>t.reply==='We received your request.'));
   assert.ok(!(await call('/support',a)).data.some(t=>t.reply==='We received your request.')); 
  });
 });
} finally {await new Promise(r=>server.close(r));database.close();rmSync(process.env.DATA_DIR,{recursive:true,force:true});}
