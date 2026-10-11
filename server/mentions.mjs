import {mentionTokens} from '../mobile/mention-tokens.mjs';
export function createMentions({db,one,all,run,blocked,notify,requireThat,visiblePost}){
 db.exec('CREATE TABLE IF NOT EXISTS mention_receipts(post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,comment_id INTEGER NOT NULL DEFAULT 0,user_id TEXT NOT NULL REFERENCES users(id),PRIMARY KEY(post_id,comment_id,user_id))');
 function names(body){return [...new Set(mentionTokens(body).map(t=>t.username))];}
 function validate(body){requireThat(names(body).length<=10,400,'Tag up to 10 different usernames per post or comment.');}
 function resolve(body,actor,viewer){return names(body).slice(0,10).map(name=>one('SELECT id,username FROM users WHERE username=? COLLATE NOCASE AND suspended=0',name)).filter(u=>u&&!blocked(u.id,actor)&&(!viewer||!blocked(u.id,viewer))).map(u=>({id:u.id,username:u.username}));}
 function send(post,body,actor,commentId=0){for(const target of resolve(body,actor,actor)){if(target.id===actor)continue;try{visiblePost(post.id,target.id);}catch{continue;}if(run('INSERT OR IGNORE INTO mention_receipts VALUES(?,?,?)',post.id,commentId,target.id).changes)notify(target.id,actor,commentId?'mention_comment':'mention_post',post.id);}}
 function search(q,user){requireThat(typeof q==='string'&&/^[a-z0-9_]{1,24}$/i.test(q),400,'Type a username after @.');return all(`SELECT id,username,display_name FROM users u WHERE suspended=0 AND username LIKE ? ESCAPE '\\' AND NOT EXISTS(SELECT 1 FROM blocks b WHERE (b.blocker_id=? AND b.blocked_id=u.id) OR (b.blocker_id=u.id AND b.blocked_id=?)) ORDER BY username LIMIT 8`,q.replace(/[_%\\]/g,'\\$&')+'%',user.id,user.id).map(u=>({id:u.id,username:u.username,displayName:u.display_name}));}
 return {validate,resolve,send,search};
}
