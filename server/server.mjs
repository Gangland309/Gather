import { createServer } from 'node:http';
import { DatabaseSync } from 'node:sqlite';
import { randomBytes, randomUUID, createHash, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { mkdirSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const scrypt = promisify(scryptCallback);
const here = dirname(fileURLToPath(import.meta.url));
const dataDir = resolve(process.env.DATA_DIR || resolve(here, 'data'));
mkdirSync(resolve(dataDir, 'media'), { recursive: true });
const db = new DatabaseSync(resolve(dataDir, 'gather.sqlite'));
db.exec(`PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL;
 CREATE TABLE IF NOT EXISTS users(id TEXT PRIMARY KEY,email TEXT UNIQUE NOT NULL,username TEXT UNIQUE NOT NULL,display_name TEXT NOT NULL,bio TEXT NOT NULL DEFAULT '',password_hash TEXT NOT NULL,salt TEXT NOT NULL,created_at TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS sessions(hash TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,expires_at INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS uploads(id TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id),filename TEXT NOT NULL,mime TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS posts(id INTEGER PRIMARY KEY AUTOINCREMENT,user_id TEXT NOT NULL REFERENCES users(id),body TEXT NOT NULL,media_id TEXT REFERENCES uploads(id),created_at TEXT NOT NULL,hidden INTEGER NOT NULL DEFAULT 0);
 CREATE TABLE IF NOT EXISTS likes(user_id TEXT REFERENCES users(id),post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,PRIMARY KEY(user_id,post_id));
 CREATE TABLE IF NOT EXISTS follows(follower_id TEXT REFERENCES users(id),followed_id TEXT REFERENCES users(id),PRIMARY KEY(follower_id,followed_id),CHECK(follower_id<>followed_id));
 CREATE TABLE IF NOT EXISTS blocks(blocker_id TEXT REFERENCES users(id),blocked_id TEXT REFERENCES users(id),PRIMARY KEY(blocker_id,blocked_id),CHECK(blocker_id<>blocked_id));
 CREATE TABLE IF NOT EXISTS comments(id INTEGER PRIMARY KEY AUTOINCREMENT,post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,user_id TEXT REFERENCES users(id),body TEXT NOT NULL,created_at TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS reports(id INTEGER PRIMARY KEY AUTOINCREMENT,reporter_id TEXT REFERENCES users(id),post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,reason TEXT NOT NULL,created_at TEXT NOT NULL,resolved INTEGER NOT NULL DEFAULT 0,UNIQUE(reporter_id,post_id));
 CREATE TABLE IF NOT EXISTS notifications(id INTEGER PRIMARY KEY AUTOINCREMENT,user_id TEXT REFERENCES users(id),actor_id TEXT REFERENCES users(id),kind TEXT NOT NULL,post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,created_at TEXT NOT NULL,seen INTEGER NOT NULL DEFAULT 0);
 CREATE INDEX IF NOT EXISTS posts_user ON posts(user_id,id);
 CREATE INDEX IF NOT EXISTS comments_post ON comments(post_id,id);
 CREATE INDEX IF NOT EXISTS notifications_user ON notifications(user_id,id);
 CREATE INDEX IF NOT EXISTS sessions_user ON sessions(user_id);
 CREATE INDEX IF NOT EXISTS follows_followed ON follows(followed_id);
`);
const one = (sql, ...p) => db.prepare(sql).get(...p);
const all = (sql, ...p) => db.prepare(sql).all(...p);
const run = (sql, ...p) => db.prepare(sql).run(...p);
const now = () => new Date().toISOString();
const hash = value => createHash('sha256').update(value).digest('hex');
const adminEmail = (process.env.ADMIN_EMAIL || '').toLowerCase();
const allowedOrigins = new Set((process.env.CORS_ORIGINS || 'http://localhost:8081,http://127.0.0.1:8081,http://localhost:19006').split(',').map(v => v.trim()));
const windows = new Map();
const cleanup = setInterval(() => {
 const t = Date.now();
 for (const [key, value] of windows) if (value.until < t) windows.delete(key);
 run('DELETE FROM sessions WHERE expires_at<?', t);
}, 60000);
cleanup.unref();
class HttpError extends Error { constructor(status, message) { super(message); this.status = status; } }
function requireThat(condition, status, message) { if (!condition) throw new HttpError(status, message); }
function textField(value, name, max, min = 0) {
 requireThat(typeof value === 'string', 400, `${name} must be text.`);
 const text = value.trim();
 requireThat(text.length >= min && text.length <= max, 400, `${name} must contain ${min}–${max} characters.`);
 return text;
}
function limit(req, category, maximum, duration) {
 // Never trust arbitrary X-Forwarded-For headers. Configure a trusted proxy before public deployment.
 const key = `${req.socket.remoteAddress}:${category}`;
 const t = Date.now();
 let entry = windows.get(key);
 if (!entry || entry.until < t) { entry = { count: 0, until: t + duration }; windows.set(key, entry); }
 requireThat(++entry.count <= maximum, 429, 'Too many requests. Try again later.');
}
function transaction(fn) { db.exec('BEGIN IMMEDIATE'); try { const result = fn(); db.exec('COMMIT'); return result; } catch (e) { db.exec('ROLLBACK'); throw e; } }
async function jsonBody(req, maxBytes = 32768) {
 requireThat((req.headers['content-type'] || '').split(';')[0] === 'application/json', 415, 'Send application/json.');
 let bytes = 0; const chunks = [];
 for await (const chunk of req) { bytes += chunk.length; requireThat(bytes <= maxBytes, 413, 'Request is too large.'); chunks.push(chunk); }
 try { const result = JSON.parse(Buffer.concat(chunks).toString('utf8')); requireThat(result && typeof result === 'object' && !Array.isArray(result),400,'Send a JSON object.'); return result; }
 catch(e) { if (e instanceof HttpError) throw e; throw new HttpError(400, 'Invalid JSON.'); }
}
function auth(req) {
 const token = /^Bearer ([A-Za-z0-9_-]{43})$/.exec(req.headers.authorization || '')?.[1];
 requireThat(token, 401, 'Please sign in.');
 const user = one('SELECT u.* FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.hash=? AND s.expires_at>?', hash(token), Date.now());
 requireThat(user, 401, 'Session expired. Please sign in again.');
 return user;
}
function profile(user, viewer) {
 return { id:user.id, username:user.username, displayName:user.display_name, bio:user.bio, createdAt:user.created_at,
  followers:one('SELECT COUNT(*) n FROM follows WHERE followed_id=?',user.id).n,
  following:one('SELECT COUNT(*) n FROM follows WHERE follower_id=?',user.id).n,
  isFollowing:!!one('SELECT 1 FROM follows WHERE follower_id=? AND followed_id=?',viewer,user.id),
  isBlocked:!!one('SELECT 1 FROM blocks WHERE blocker_id=? AND blocked_id=?',viewer,user.id) };
}
function me(user) { return {...profile(user,user.id), isAdmin:!!adminEmail && user.email===adminEmail}; }
function blocked(a,b) { return !!one('SELECT 1 FROM blocks WHERE (blocker_id=? AND blocked_id=?) OR (blocker_id=? AND blocked_id=?)',a,b,b,a); }
function visiblePost(id, viewer) { const post = one('SELECT * FROM posts WHERE id=? AND hidden=0',id); requireThat(post && !blocked(viewer,post.user_id),404,'Post not found.'); return post; }
function notify(target, actor, kind, postId=null) { if(target!==actor) run('INSERT INTO notifications(user_id,actor_id,kind,post_id,created_at) VALUES(?,?,?,?,?)',target,actor,kind,postId,now()); }
function postView(p,viewer) {
 const user = one('SELECT * FROM users WHERE id=?',p.user_id);
 const upload = p.media_id ? one('SELECT * FROM uploads WHERE id=?',p.media_id) : null;
 return { id:p.id, body:p.body, createdAt:p.created_at, author:profile(user,viewer), mediaUrl:upload ? `/media/${upload.filename}` : null,
  likeCount:one('SELECT COUNT(*) n FROM likes l JOIN users u ON u.id=l.user_id WHERE l.post_id=? AND NOT EXISTS (SELECT 1 FROM blocks b WHERE (b.blocker_id=? AND b.blocked_id=u.id) OR (b.blocker_id=u.id AND b.blocked_id=?))',p.id,viewer,viewer).n,
  commentCount:one('SELECT COUNT(*) n FROM comments c WHERE c.post_id=? AND NOT EXISTS (SELECT 1 FROM blocks b WHERE (b.blocker_id=? AND b.blocked_id=c.user_id) OR (b.blocker_id=c.user_id AND b.blocked_id=?))',p.id,viewer,viewer).n,
  liked:!!one('SELECT 1 FROM likes WHERE user_id=? AND post_id=?',viewer,p.id) };
}
async function api(req,url) {
 const method = req.method, path = url.pathname;
 if(path==='/api/health' && method==='GET') return {status:'ok'};
 if(['/api/auth/register','/api/auth/login'].includes(path) && method==='POST') {
  limit(req,'auth',20,15*60000);
  const input=await jsonBody(req);
  const email=textField(input.email,'Email',254,3).toLowerCase();
  requireThat(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),400,'Enter a valid email.');
  const password = input.password;
  requireThat(typeof password==='string' && password.length>=12 && password.length<=128,400,'Password must contain 12–128 characters.');
  let user;
  if(path.endsWith('register')) {
   const username=textField(input.username,'Username',24,3).toLowerCase();
   requireThat(/^[a-z0-9_]+$/.test(username),400,'Username can use letters, numbers, and underscores.');
   const displayName=textField(input.displayName,'Display name',60,1);
   const salt=randomBytes(16).toString('hex');
   const passwordHash=(await scrypt(password,salt,64)).toString('hex');
   try { const id=randomUUID(); run('INSERT INTO users(id,email,username,display_name,password_hash,salt,created_at) VALUES(?,?,?,?,?,?,?)',id,email,username,displayName,passwordHash,salt,now()); user=one('SELECT * FROM users WHERE id=?',id); }
   catch(e) { if(String(e.message).includes('UNIQUE')) throw new HttpError(409,'Email or username is already in use.'); throw e; }
  } else {
   user=one('SELECT * FROM users WHERE email=?',email);
   // Same password work for unknown emails to reduce account enumeration by timing.
   const candidate=await scrypt(password,user?.salt || '00000000000000000000000000000000',64);
   const expected=Buffer.from(user?.password_hash || '00'.repeat(64),'hex');
   requireThat(user && timingSafeEqual(candidate,expected),401,'Email or password is incorrect.');
  }
  const token=randomBytes(32).toString('base64url');
  run('INSERT INTO sessions(hash,user_id,expires_at) VALUES(?,?,?)',hash(token),user.id,Date.now()+7*24*3600000);
  return {token,user:me(user)};
 }
 const user=auth(req);
 if(method!=='GET') limit(req,'write',120,60000);
 if(path==='/api/auth/logout' && method==='POST') { run('DELETE FROM sessions WHERE hash=?',hash(req.headers.authorization.slice(7))); return {ok:true}; }
 if(path==='/api/me' && method==='GET') return me(user);
 if(path==='/api/me' && method==='PATCH') { const input=await jsonBody(req); run('UPDATE users SET display_name=?,bio=? WHERE id=?',textField(input.displayName,'Display name',60,1),textField(input.bio,'Bio',300),user.id); return me(one('SELECT * FROM users WHERE id=?',user.id)); }
 if(path==='/api/users' && method==='GET') {
  const q=(url.searchParams.get('q') || '').slice(0,60).replace(/[\\%_]/g,'\\$&');
  return all(`SELECT * FROM users u WHERE (username LIKE ? ESCAPE '\\' OR display_name LIKE ? ESCAPE '\\') AND NOT EXISTS(SELECT 1 FROM blocks b WHERE (b.blocker_id=? AND b.blocked_id=u.id) OR (b.blocker_id=u.id AND b.blocked_id=?)) ORDER BY created_at DESC LIMIT 30`,`%${q}%`,`%${q}%`,user.id,user.id).map(u=>profile(u,user.id));
 }
 if(path==='/api/blocks' && method==='GET') return all('SELECT u.* FROM blocks b JOIN users u ON u.id=b.blocked_id WHERE b.blocker_id=?',user.id).map(u=>profile(u,user.id));
 let m;
 if((m=/^\/api\/users\/([a-zA-Z0-9-]+)(?:\/(follow|block))?$/.exec(path))) {
  const target=one('SELECT * FROM users WHERE id=?',m[1]); requireThat(target,404,'User not found.');
  if(!m[2] && method==='GET') { requireThat(!blocked(user.id,target.id),404,'User not found.'); return profile(target,user.id); }
  requireThat(user.id!==target.id,400,'Choose another user.');
  if(m[2]==='block' && method==='PUT') { transaction(()=>{run('INSERT OR IGNORE INTO blocks VALUES(?,?)',user.id,target.id); run('DELETE FROM follows WHERE (follower_id=? AND followed_id=?) OR (follower_id=? AND followed_id=?)',user.id,target.id,target.id,user.id);}); return {ok:true}; }
  if(m[2]==='block' && method==='DELETE') {run('DELETE FROM blocks WHERE blocker_id=? AND blocked_id=?',user.id,target.id);return {ok:true};}
  if(m[2]==='follow') {
   requireThat(!blocked(user.id,target.id),404,'User not found.');
   if(method==='PUT') {transaction(()=>{if(run('INSERT OR IGNORE INTO follows VALUES(?,?)',user.id,target.id).changes) notify(target.id,user.id,'follow');});return profile(target,user.id);}
   if(method==='DELETE') {run('DELETE FROM follows WHERE follower_id=? AND followed_id=?',user.id,target.id);return profile(target,user.id);}
  }
 }
 if(path==='/api/uploads' && method==='POST') {
  limit(req,'upload',10,60000);
  const input=await jsonBody(req,8*1024*1024);
  requireThat(typeof input.base64==='string' && /^[A-Za-z0-9+/]*={0,2}$/.test(input.base64) && input.base64.length%4===0,400,'Invalid image data.');
  const data=Buffer.from(input.base64,'base64');
  requireThat(data.length>0 && data.length<=5*1024*1024,413,'Images must be smaller than 5 MB.');
  const jpg=data.subarray(0,3).equals(Buffer.from([255,216,255]));
  const png=data.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
  const webp=data.toString('ascii',0,4)==='RIFF' && data.toString('ascii',8,12)==='WEBP';
  requireThat(jpg||png||webp,400,'Upload a JPEG, PNG, or WebP image.');
  const id=randomUUID(), extension=jpg?'jpg':png?'png':'webp', filename=`${id}.${extension}`, mime=`image/${jpg?'jpeg':extension}`;
  writeFileSync(resolve(dataDir,'media',filename),data,{flag:'wx'});
  run('INSERT INTO uploads VALUES(?,?,?,?)',id,user.id,filename,mime);
  return {id,url:`/media/${filename}`};
 }
 if(path==='/api/posts' && method==='POST') {
  const input=await jsonBody(req),body=textField(input.body,'Post',2000),mediaId=input.mediaId??null;
  requireThat(body || mediaId,400,'Write something or add a photo.');
  if(mediaId) requireThat(typeof mediaId==='string' && one('SELECT 1 FROM uploads WHERE id=? AND user_id=?',mediaId,user.id),400,'Photo not found.');
  const id=Number(run('INSERT INTO posts(user_id,body,media_id,created_at) VALUES(?,?,?,?)',user.id,body,mediaId,now()).lastInsertRowid);
  return postView(one('SELECT * FROM posts WHERE id=?',id),user.id);
 }
 if(path==='/api/posts' && method==='GET') {
  const before=Number(url.searchParams.get('before') || Number.MAX_SAFE_INTEGER);
  requireThat(Number.isSafeInteger(before) && before>0,400,'Invalid cursor.');
  const author=url.searchParams.get('author') || '', following=url.searchParams.get('following')==='true';
  const posts=all(`SELECT p.* FROM posts p WHERE p.hidden=0 AND p.id<? AND (?='' OR p.user_id=?) AND (?=0 OR p.user_id=? OR EXISTS(SELECT 1 FROM follows f WHERE f.follower_id=? AND f.followed_id=p.user_id)) AND NOT EXISTS(SELECT 1 FROM blocks b WHERE (b.blocker_id=? AND b.blocked_id=p.user_id) OR (b.blocker_id=p.user_id AND b.blocked_id=?)) ORDER BY p.id DESC LIMIT 20`,before,author,author,following?1:0,user.id,user.id,user.id,user.id);
  return {posts:posts.map(p=>postView(p,user.id)),nextCursor:posts.length===20?posts.at(-1).id:null};
 }
 if((m=/^\/api\/posts\/(\d+)(?:\/(like|comments|report))?$/.exec(path))) {
  const id=Number(m[1]),post=visiblePost(id,user.id);
  if(!m[2] && method==='DELETE') {requireThat(post.user_id===user.id,403,'You can delete only your own posts.');run('DELETE FROM posts WHERE id=?',id);return {ok:true};}
  if(m[2]==='like' && method==='PUT') {transaction(()=>{if(run('INSERT OR IGNORE INTO likes VALUES(?,?)',user.id,id).changes) notify(post.user_id,user.id,'like',id);});return postView(post,user.id);}
  if(m[2]==='like' && method==='DELETE') {run('DELETE FROM likes WHERE user_id=? AND post_id=?',user.id,id);return postView(post,user.id);}
  if(m[2]==='comments' && method==='GET') return all(`SELECT c.* FROM comments c WHERE post_id=? AND NOT EXISTS(SELECT 1 FROM blocks b WHERE (b.blocker_id=? AND b.blocked_id=c.user_id) OR (b.blocker_id=c.user_id AND b.blocked_id=?)) ORDER BY c.id DESC LIMIT 100`,id,user.id,user.id).reverse().map(c=>({id:c.id,body:c.body,createdAt:c.created_at,author:profile(one('SELECT * FROM users WHERE id=?',c.user_id),user.id)}));
  if(m[2]==='comments' && method==='POST') {const input=await jsonBody(req);transaction(()=>{run('INSERT INTO comments(post_id,user_id,body,created_at) VALUES(?,?,?,?)',id,user.id,textField(input.body,'Comment',1000,1),now());notify(post.user_id,user.id,'comment',id);});return {ok:true};}
  if(m[2]==='report' && method==='POST') {const input=await jsonBody(req);run('INSERT OR IGNORE INTO reports(reporter_id,post_id,reason,created_at) VALUES(?,?,?,?)',user.id,id,textField(input.reason,'Reason',500,3),now());return {ok:true};}
 }
 if(path==='/api/notifications' && method==='GET') return all(`SELECT n.*,u.username,u.display_name FROM notifications n JOIN users u ON u.id=n.actor_id LEFT JOIN posts p ON p.id=n.post_id WHERE n.user_id=? AND (n.post_id IS NULL OR p.hidden=0) AND NOT EXISTS(SELECT 1 FROM blocks b WHERE (b.blocker_id=? AND b.blocked_id=n.actor_id) OR (b.blocker_id=n.actor_id AND b.blocked_id=?)) ORDER BY n.id DESC LIMIT 100`,user.id,user.id,user.id).map(n=>({id:n.id,kind:n.kind,username:n.username,displayName:n.display_name,postId:n.post_id,createdAt:n.created_at,seen:!!n.seen}));
 if(path==='/api/notifications/read' && method==='POST') {run('UPDATE notifications SET seen=1 WHERE user_id=?',user.id);return {ok:true};}
 if(path.startsWith('/api/admin/')) {
  requireThat(!!adminEmail && user.email===adminEmail,403,'Administrator access required.');
  if(path==='/api/admin/reports' && method==='GET') return all('SELECT r.*,p.body,u.username FROM reports r JOIN posts p ON p.id=r.post_id JOIN users u ON u.id=r.reporter_id WHERE r.resolved=0 ORDER BY r.id DESC LIMIT 100');
  if((m=/^\/api\/admin\/reports\/(\d+)$/.exec(path)) && method==='PATCH') {
   const input=await jsonBody(req), report=one('SELECT * FROM reports WHERE id=?',Number(m[1]));requireThat(report,404,'Report not found.');requireThat(typeof input.hidePost==='boolean',400,'hidePost must be true or false.');
   transaction(()=>{if(input.hidePost)run('UPDATE posts SET hidden=1 WHERE id=?',report.post_id);run('UPDATE reports SET resolved=1 WHERE id=?',report.id);});return {ok:true};
  }
 }
 throw new HttpError(404,'Route not found.');
}
const mimeTypes={'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.ico':'image/x-icon','.ttf':'font/ttf'};
const webDir=resolve(here,'../mobile/dist');
export const server=createServer(async(req,res)=>{
 res.setHeader('X-Content-Type-Options','nosniff');
 res.setHeader('Referrer-Policy','no-referrer');
 try {
  const url=new URL(req.url,'http://localhost');
  if(url.pathname.startsWith('/api/')) {
   res.setHeader('Cache-Control','no-store');
   const origin=req.headers.origin;
   const ownOrigin=`${req.socket.encrypted?'https':'http'}://${req.headers.host}`;
   requireThat(!origin || allowedOrigins.has(origin) || origin===ownOrigin,403,'Origin is not allowed.');
   if(origin){res.setHeader('Access-Control-Allow-Origin',origin);res.setHeader('Vary','Origin');}
   if(req.method==='OPTIONS'){res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE,OPTIONS');res.setHeader('Access-Control-Allow-Headers','Authorization,Content-Type');res.writeHead(204);res.end();return;}
   const result=await api(req,url);res.writeHead(200,{'Content-Type':'application/json'});res.end(JSON.stringify(result));return;
  }
  requireThat(req.method==='GET' || req.method==='HEAD',405,'Method not allowed.');
  if(/^\/media\/[a-f0-9-]+\.(jpg|png|webp)$/.test(url.pathname)) {
   const name=url.pathname.split('/').at(-1);
   // Serve only media attached to a visible post. Unattached uploads are private staging files.
   const media=one('SELECT u.* FROM uploads u JOIN posts p ON p.media_id=u.id WHERE u.filename=? AND p.hidden=0',name);
   requireThat(media,404,'Image not found.');
   res.writeHead(200,{'Content-Type':media.mime,'Cache-Control':'no-store'});res.end(req.method==='HEAD'?undefined:readFileSync(resolve(dataDir,'media',name)));return;
  }
  const file=resolve(webDir,`.${decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname)}`);
  requireThat(file.startsWith(webDir+sep),404,'Not found.');
  requireThat(existsSync(file),404,'Build the web client with npm run build:web, or use the Expo development server.');
  res.writeHead(200,{'Content-Type':mimeTypes[extname(file)]||'application/octet-stream'});res.end(req.method==='HEAD'?undefined:readFileSync(file));
 } catch(e) {
  if(res.headersSent){res.end();return;}
  const status=e instanceof HttpError?e.status:500;
  if(status===500) console.error('Request failed:',e.message);
  res.writeHead(status,{'Content-Type':'application/json'});res.end(JSON.stringify({error:status===500?'An unexpected server error occurred.':e.message}));
 }
});
if(process.argv[1]===fileURLToPath(import.meta.url)) {
 const port=Number(process.env.PORT||8787),host=process.env.HOST||'127.0.0.1';
 server.listen(port,host,()=>console.log(`Gather API listening on http://${host}:${port}`));
 const stop=()=>server.close(()=>{db.close();process.exit(0);});process.on('SIGTERM',stop);process.on('SIGINT',stop);
}
