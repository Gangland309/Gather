export function createSocial({db,one,all,run,now,requireThat,textField,blocked,profile,visiblePost,postView,jsonBody,transaction,me,notify}) {
 db.exec(`CREATE TABLE IF NOT EXISTS conversations(id INTEGER PRIMARY KEY AUTOINCREMENT,a TEXT NOT NULL REFERENCES users(id),b TEXT NOT NULL REFERENCES users(id),initiator TEXT NOT NULL REFERENCES users(id),recipient TEXT NOT NULL REFERENCES users(id),status TEXT NOT NULL,created_at TEXT NOT NULL,UNIQUE(a,b),CHECK(a<>b));
 CREATE TABLE IF NOT EXISTS messages(id INTEGER PRIMARY KEY AUTOINCREMENT,conversation_id INTEGER NOT NULL REFERENCES conversations(id),sender_id TEXT NOT NULL REFERENCES users(id),body TEXT NOT NULL,created_at TEXT NOT NULL,seen INTEGER NOT NULL DEFAULT 0);
 CREATE INDEX IF NOT EXISTS messages_conversation ON messages(conversation_id,id);
 CREATE TABLE IF NOT EXISTS cases(id INTEGER PRIMARY KEY AUTOINCREMENT,reporter_id TEXT NOT NULL REFERENCES users(id),kind TEXT NOT NULL,target_id TEXT,reason TEXT NOT NULL,created_at TEXT NOT NULL,resolved INTEGER NOT NULL DEFAULT 0);`);
 const caseColumns=db.prepare('PRAGMA table_info(cases)').all().map(c=>c.name);
 if(!caseColumns.includes('reply')) db.exec("ALTER TABLE cases ADD COLUMN reply TEXT NOT NULL DEFAULT ''");
 const column=db.prepare('PRAGMA table_info(posts)').all().map(c=>c.name);
 if(!column.includes('original_id')) db.exec('ALTER TABLE posts ADD COLUMN original_id INTEGER REFERENCES posts(id) ON DELETE CASCADE');
 db.exec('CREATE UNIQUE INDEX IF NOT EXISTS unique_repost ON posts(user_id,original_id) WHERE original_id IS NOT NULL');
 function conversation(id,user) {
  const c=one('SELECT * FROM conversations WHERE id=?',id);
  requireThat(c && [c.a,c.b].includes(user.id) && !blocked(c.a,c.b),404,'Conversation not found.');
  return c;
 }
 function conversationView(c,user) {
  const person=one('SELECT * FROM users WHERE id=?',c.a===user.id?c.b:c.a);
  return {id:c.id,person:profile(person,user.id),status:c.status,incoming:c.recipient===user.id,
   unread:one('SELECT COUNT(*) n FROM messages WHERE conversation_id=? AND sender_id<>? AND seen=0',c.id,user.id).n};
 }
 return async function social(req,url,user) {
  const path=url.pathname,method=req.method;
  let m;
  if(path==='/api/me/avatar' && ['PUT','DELETE'].includes(method)) {
   let id=null;
   if(method==='PUT') {const input=await jsonBody(req);id=input.mediaId;requireThat(typeof id==='string' && one('SELECT 1 FROM uploads WHERE id=? AND user_id=?',id,user.id),400,'Upload your own photo first.');}
   run('UPDATE users SET avatar_id=? WHERE id=?',id,user.id);return me(one('SELECT * FROM users WHERE id=?',user.id));
  }
  if((m=/^\/api\/posts\/(\d+)$/.exec(path)) && method==='GET') return postView(visiblePost(Number(m[1]),user.id),user.id);
  if((m=/^\/api\/posts\/(\d+)\/repost$/.exec(path)) && method==='POST') {
   let original=visiblePost(Number(m[1]),user.id);if(original.original_id) original=visiblePost(original.original_id,user.id);
   requireThat(original.user_id!==user.id,400,'Choose another person’s post to repost.');
   const input=await jsonBody(req),body=textField(input.body||'','Caption',2000);
   if(run('INSERT OR IGNORE INTO posts(user_id,body,created_at,original_id) VALUES(?,?,?,?)',user.id,body,now(),original.id).changes)notify(original.user_id,user.id,'repost',original.id);
   return postView(one('SELECT * FROM posts WHERE user_id=? AND original_id=?',user.id,original.id),user.id);
  }
  if(path==='/api/conversations' && method==='GET') return all("SELECT * FROM conversations c WHERE (a=? OR b=?) AND status<>'declined' AND NOT EXISTS(SELECT 1 FROM blocks WHERE (blocker_id=c.a AND blocked_id=c.b) OR (blocker_id=c.b AND blocked_id=c.a)) ORDER BY id DESC LIMIT 100",user.id,user.id).map(c=>conversationView(c,user));
  if(path==='/api/conversations' && method==='POST') {
   const input=await jsonBody(req),target=one('SELECT * FROM users WHERE id=?',textField(input.userId,'Person',50,1));
   requireThat(target && target.id!==user.id && !blocked(user.id,target.id),404,'Person not available.');
   const body=textField(input.body,'Message',2000,1);
   const [a,b]=[user.id,target.id].sort();
   const result=transaction(()=>{
    let c=one('SELECT * FROM conversations WHERE a=? AND b=?',a,b);
    if(!c) {const accepted=!!one('SELECT 1 FROM follows WHERE follower_id=? AND followed_id=?',target.id,user.id);
     const id=Number(run('INSERT INTO conversations(a,b,initiator,recipient,status,created_at) VALUES(?,?,?,?,?,?)',a,b,user.id,target.id,accepted?'accepted':'pending',now()).lastInsertRowid);c=one('SELECT * FROM conversations WHERE id=?',id);
    }
    requireThat(c.status==='accepted' || (c.status==='pending' && c.initiator===user.id && !one('SELECT 1 FROM messages WHERE conversation_id=?',c.id)),403,'Wait for your message request to be accepted.');
    run('INSERT INTO messages(conversation_id,sender_id,body,created_at) VALUES(?,?,?,?)',c.id,user.id,body,now());notify(target.id,user.id,c.status==='pending'?'message_request':'message');return c;
   });return conversationView(result,user);
  }
  if((m=/^\/api\/conversations\/(\d+)(?:\/(messages|decision|read))?$/.exec(path))) {
   const c=conversation(Number(m[1]),user);
   if(m[2]==='messages' && method==='GET') {
    requireThat(c.status!=='declined',404,'Conversation not found.');
    const before=Number(url.searchParams.get('before')||Number.MAX_SAFE_INTEGER);requireThat(Number.isSafeInteger(before)&&before>0,400,'Invalid cursor.');
    const messages=all('SELECT * FROM messages WHERE conversation_id=? AND id<? ORDER BY id DESC LIMIT 50',c.id,before).reverse();
    return {conversation:conversationView(c,user),messages:messages.map(v=>({id:v.id,body:v.body,senderId:v.sender_id,createdAt:v.created_at})),nextCursor:messages.length===50?messages[0].id:null};
   }
   if(m[2]==='messages' && method==='POST') {
    requireThat(c.status==='accepted',403,'Accept the request before sending messages.');
    const input=await jsonBody(req);run('INSERT INTO messages(conversation_id,sender_id,body,created_at) VALUES(?,?,?,?)',c.id,user.id,textField(input.body,'Message',2000,1),now());notify(c.a===user.id?c.b:c.a,user.id,'message');return {ok:true};
   }
   if(m[2]==='decision' && method==='POST') {
    requireThat(c.recipient===user.id && c.status==='pending',403,'Only the recipient can respond to this request.');
    const input=await jsonBody(req);requireThat(['accept','decline'].includes(input.action),400,'Choose accept or decline.');
    run('UPDATE conversations SET status=? WHERE id=?',input.action==='accept'?'accepted':'declined',c.id);return {ok:true};
   }
   if(m[2]==='read' && method==='POST') {run('UPDATE messages SET seen=1 WHERE conversation_id=? AND sender_id<>?',c.id,user.id);return {ok:true};}
  }
  if(path==='/api/reports' && method==='POST') {
   const input=await jsonBody(req),kind=input.kind;
   requireThat(['profile','message'].includes(kind),400,'Choose profile or message.');
   const targetId=textField(String(input.targetId||''),'Target',50,1);
   if(kind==='profile') requireThat(one('SELECT 1 FROM users WHERE id=? AND id<>?',targetId,user.id) && !blocked(user.id,targetId),404,'Profile not found.');
   else {const message=one('SELECT * FROM messages WHERE id=?',targetId);requireThat(message,404,'Message not found.');conversation(message.conversation_id,user);requireThat(message.sender_id!==user.id,400,'Choose an incoming message.');}
   run('INSERT INTO cases(reporter_id,kind,target_id,reason,created_at) VALUES(?,?,?,?,?)',user.id,kind,targetId,textField(input.reason,'Reason',2000,3),now());return {ok:true};
  }
  if(path==='/api/support' && method==='GET') return all('SELECT id,kind,reason,reply,resolved,created_at FROM cases WHERE reporter_id=? ORDER BY id DESC LIMIT 100',user.id);
  if(path==='/api/support' && method==='POST') {
   const input=await jsonBody(req);run('INSERT INTO cases(reporter_id,kind,reason,created_at) VALUES(?,?,?,?)',user.id,'support',textField(input.body,'Support request',4000,5),now());return {ok:true};
  }
  if(path==='/api/admin/cases' && method==='GET') {
   requireThat(me(user).isAdmin,403,'Administrator access required.');
   return all(`SELECT c.*,u.username FROM cases c JOIN users u ON u.id=c.reporter_id WHERE resolved=0 ORDER BY c.id DESC LIMIT 100`).map(c=>({...c,
    content:c.kind==='message'?one('SELECT body FROM messages WHERE id=?',c.target_id)?.body:c.kind==='profile'?one('SELECT username FROM users WHERE id=?',c.target_id)?.username:null}));
  }
  if((m=/^\/api\/admin\/cases\/(\d+)$/.exec(path)) && method==='PATCH') {
   requireThat(me(user).isAdmin,403,'Administrator access required.');
   const input=await jsonBody(req);requireThat(input.resolved===true,400,'Set resolved to true.');
   const reply=textField(input.reply||'','Reply',4000);
   const report=one('SELECT * FROM cases WHERE id=?',Number(m[1]));requireThat(report,404,'Report not found.');run('UPDATE cases SET resolved=1,reply=? WHERE id=?',reply,report.id);if(reply&&report.kind==='support')notify(report.reporter_id,user.id,'support_reply');return {ok:true};
  }
  return undefined;
 };
}
