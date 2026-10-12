import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {createChatAssistant} from '../server/chat-assistant.mjs';
process.env.NODE_ENV='test';
test('Responses request preserves GPT-5 model choice, disables response storage and sends no account context',async()=>{
 const db=new DatabaseSync(':memory:'),original=globalThis.fetch,oldKey=process.env.OPENAI_API_KEY,oldEnabled=process.env.CHAT_ASSISTANT_ENABLED,oldModel=process.env.CHAT_ASSISTANT_MODEL;
 process.env.OPENAI_API_KEY='fake-test-key';process.env.CHAT_ASSISTANT_ENABLED='true';process.env.CHAT_ASSISTANT_MODEL='gpt-5-mini';
 const c={db,one:(s,...v)=>db.prepare(s).get(...v),run:(s,...v)=>db.prepare(s).run(...v),transaction:fn=>{db.exec('BEGIN');try{const result=fn();db.exec('COMMIT');return result;}catch(e){db.exec('ROLLBACK');throw e;}},jsonBody:async req=>req.body,requireThat:(condition,status,message)=>{if(!condition)throw Object.assign(new Error(message),{status});}};
 const assistant=createChatAssistant(c);let requests=0;
 globalThis.fetch=async(url,options)=>{requests++;assert.equal(url,'https://api.openai.com/v1/responses');const body=JSON.parse(options.body);assert.equal(body.model,'gpt-5-mini');assert.equal(body.store,false);assert.equal(body.max_output_tokens,2000);assert.deepEqual(body.reasoning,{effort:'low'});assert.deepEqual(body.input,[{role:'user',content:'Write a caption'}]);assert.equal(JSON.stringify(body).includes('private-email'),false);assert.equal(body.tools,undefined);return Response.json({status:'completed',output:[{type:'reasoning',summary:[]},{type:'message',content:[{type:'output_text',text:'Your next adventure starts here.'}]}]});};
 try{const result=await assistant.route({method:'POST',body:{message:'Write a caption'}},new URL('http://localhost/api/assistant/chat'),{id:'test-user',email_verified:1,email:'private-email'});assert.equal(result.reply,'Your next adventure starts here.');assert.equal(requests,1);globalThis.fetch=async()=>Response.json({status:'incomplete',output:[]});await assert.rejects(()=>assistant.route({method:'POST',body:{message:'Try again'}},new URL('http://localhost/api/assistant/chat'),{id:'test-user',email_verified:1}),{status:502});}
 finally{globalThis.fetch=original;for(const [name,value] of [['OPENAI_API_KEY',oldKey],['CHAT_ASSISTANT_ENABLED',oldEnabled],['CHAT_ASSISTANT_MODEL',oldModel]]){if(value===undefined)delete process.env[name];else process.env[name]=value;}db.close();}
});
test('assistant setup can change after an initial disabled check; failed submissions remain server-gated',async()=>{
 const db=new DatabaseSync(':memory:'),oldKey=process.env.OPENAI_API_KEY,oldEnabled=process.env.CHAT_ASSISTANT_ENABLED;
 const assistant=createChatAssistant({db,requireThat:(ok,status,message)=>{if(!ok)throw Object.assign(new Error(message),{status});}});
 const user={id:'member',email_verified:1},config=new URL('http://localhost/api/assistant/config');
 try{
  delete process.env.OPENAI_API_KEY;process.env.CHAT_ASSISTANT_ENABLED='false';
  assert.deepEqual(await assistant.route({method:'GET'},config,user),{enabled:false});
  await assert.rejects(()=>assistant.route({method:'POST'},new URL('http://localhost/api/assistant/chat'),user),e=>e.status===503&&e.message.includes('CHAT_ASSISTANT_ENABLED=true')&&e.message.includes('ASSISTANT-SETUP.md'));
  process.env.CHAT_ASSISTANT_ENABLED='true';assert.deepEqual(await assistant.route({method:'GET'},config,user),{enabled:false});
  process.env.OPENAI_API_KEY='test-secret';assert.deepEqual(await assistant.route({method:'GET'},config,user),{enabled:true});
  await assert.rejects(()=>assistant.route({method:'GET'},config,null),{status:401});
 }finally{for(const [name,value] of [['OPENAI_API_KEY',oldKey],['CHAT_ASSISTANT_ENABLED',oldEnabled]]){if(value===undefined)delete process.env[name];else process.env[name]=value;}db.close();}
});
test('removed production chat endpoints cannot call the provider even if old configuration enables them',async()=>{
 const db=new DatabaseSync(':memory:'),old=process.env.NODE_ENV,enabled=process.env.CHAT_ASSISTANT_ENABLED;process.env.NODE_ENV='production';process.env.CHAT_ASSISTANT_ENABLED='true';
 const assistant=createChatAssistant({db,requireThat:(ok,status,message)=>{if(!ok)throw Object.assign(new Error(message),{status});}});
 try{for(const path of ['config','chat'])await assert.rejects(()=>assistant.route({method:path==='chat'?'POST':'GET'},new URL('http://localhost/api/assistant/'+path),{id:'member',email_verified:1}),{status:410});}finally{if(old===undefined)delete process.env.NODE_ENV;else process.env.NODE_ENV=old;if(enabled===undefined)delete process.env.CHAT_ASSISTANT_ENABLED;else process.env.CHAT_ASSISTANT_ENABLED=enabled;db.close();}
});
