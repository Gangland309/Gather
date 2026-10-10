import {createAIPageManager} from './ai-page-manager.mjs';
const prompts=[
 ['Welcome','Welcome to Gather. Tell us one interest you could talk about for hours—and find someone who shares it.'],
 ['Conversation','What is one small thing that made your week better? Share it below.'],
 ['Conversation','What have you changed your mind about recently? Let’s make room for thoughtful conversation.'],
 ['Gatherings','Looking for your people? Explore Gatherings, join a discussion around an interest, or create a space of your own. What topic would you choose?'],
 ['Community','Introduce someone to an idea you love: a book, a hobby, a project, or a place. What makes it worth sharing?'],
 ['Feature tip','Before you publish, choose your audience: Only me, Friends, Public, or a Gathering. Share with the people you intended.'],
 ['Conversation','What are you learning right now? Share a question or a useful lesson with the Gather community.'],
 ['Community','A good conversation starts with curiosity. Ask someone about the story behind their latest post.'],
 ['Feature tip','Your profile is a place to introduce yourself. Add a bio and links that help people understand what matters to you.'],
 ['Conversation','If you could start a Gathering about anything, what would its first discussion be?']
];
export function createContentBot(c){const {db,one,all,run,now,jsonBody,textField,requireThat,me,transaction}=c;
 db.exec(`CREATE TABLE IF NOT EXISTS official_drafts(id INTEGER PRIMARY KEY AUTOINCREMENT,category TEXT NOT NULL,body TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'draft',post_id INTEGER REFERENCES posts(id),created_at TEXT NOT NULL);`);
 const manager=createAIPageManager(c);
 const route=async function route(req,url,user){const managed=await manager.route(req,url,user);if(managed!==undefined)return managed;const path=url.pathname;let match;if(!path.startsWith('/api/admin/content-bot'))return;
 requireThat(user&&me(user).isAdmin,403,'Administrator access required.');
 if(path==='/api/admin/content-bot'&&req.method==='GET')return all("SELECT * FROM official_drafts WHERE status='draft' ORDER BY id LIMIT 28");
 if(path==='/api/admin/content-bot/generate'&&req.method==='POST'){requireThat(one("SELECT COUNT(*) n FROM official_drafts WHERE status='draft'").n<=21,409,'Review existing drafts before generating more.');const offset=one('SELECT COUNT(*) n FROM official_drafts').n;transaction(()=>{for(let n=0;n<7;n++){let [category,body]=prompts[(offset+n)%prompts.length];if(n===0){const groups=all('SELECT g.id,g.name,g.topic FROM gatherings g JOIN users u ON u.id=g.owner_id WHERE g.is_private=0 AND u.suspended=0 AND u.email_verified=1 ORDER BY g.id DESC LIMIT 20').filter(g=>!c.blocked(user.id,one('SELECT owner_id FROM gatherings WHERE id=?',g.id).owner_id));if(groups.length){const g=groups[offset%groups.length];category='Gathering spotlight';body=`Explore ${g.name}, a public Gathering about ${g.topic}. Join the conversation: https://gatherourworld.com/?page=Gatherings&groupId=${g.id}`;}}run('INSERT INTO official_drafts(category,body,created_at) VALUES(?,?,?)',category,body,now());}});return {ok:true};}
 if((match=/^\/api\/admin\/content-bot\/(\d+)$/.exec(path))){const id=Number(match[1]);requireThat(one('SELECT 1 FROM official_drafts WHERE id=?',id),404,'Draft not found.');if(req.method==='DELETE'){requireThat(run("DELETE FROM official_drafts WHERE id=? AND status='draft'",id).changes,409,'Already published.');return {ok:true};}if(req.method==='PATCH'){const input=await jsonBody(req),body=textField(input.body,'Draft',2000,1);requireThat(run("UPDATE official_drafts SET body=? WHERE id=? AND status='draft'",body,id).changes,409,'Already published.');return {ok:true};}if(req.method==='POST'){const input=await jsonBody(req);requireThat(input.confirmPublic===true,400,'Confirm publishing publicly.');return transaction(()=>{const draft=one('SELECT * FROM official_drafts WHERE id=?',id);if(draft.post_id)return {postId:draft.post_id};const page=one('SELECT id FROM users WHERE official=1');requireThat(page,400,'Create the official page first.');const postId=Number(run("INSERT INTO posts(user_id,body,created_at,audience) VALUES(?,?,?,'public')",page.id,draft.body,now()).lastInsertRowid);run("UPDATE official_drafts SET status='published',post_id=? WHERE id=?",postId,id);return {postId};});}}
 };
 return Object.assign(route,{start:manager.start,stop:manager.stop,tick:manager.tick});
}
