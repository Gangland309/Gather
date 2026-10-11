import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {createChatAssistant} from '../server/chat-assistant.mjs';
test('Responses request preserves GPT-5 model choice, disables response storage and sends no account context',async()=>{
 const db=new DatabaseSync(':memory:'),original=globalThis.fetch,oldKey=process.env.OPENAI_API_KEY,oldEnabled=process.env.CHAT_ASSISTANT_ENABLED,oldModel=process.env.CHAT_ASSISTANT_MODEL;
 process.env.OPENAI_API_KEY='fake-test-key';process.env.CHAT_ASSISTANT_ENABLED='true';process.env.CHAT_ASSISTANT_MODEL='gpt-5-mini';
 const c={db,one:(s,...v)=>db.prepare(s).get(...v),run:(s,...v)=>db.prepare(s).run(...v),transaction:fn=>{db.exec('BEGIN');try{const result=fn();db.exec('COMMIT');return result;}catch(e){db.exec('ROLLBACK');throw e;}},jsonBody:async req=>req.body,requireThat:(condition,status,message)=>{if(!condition)throw Object.assign(new Error(message),{status});}};
 const assistant=createChatAssistant(c);let requests=0;
 globalThis.fetch=async(url,options)=>{requests++;assert.equal(url,'https://api.openai.com/v1/responses');const body=JSON.parse(options.body);assert.equal(body.model,'gpt-5-mini');assert.equal(body.store,false);assert.equal(body.max_output_tokens,2000);assert.deepEqual(body.reasoning,{effort:'low'});assert.deepEqual(body.input,[{role:'user',content:'Write a caption'}]);assert.equal(JSON.stringify(body).includes('private-email'),false);assert.equal(body.tools,undefined);return Response.json({status:'completed',output:[{type:'reasoning',summary:[]},{type:'message',content:[{type:'output_text',text:'Your next adventure starts here.'}]}]});};
 try{const result=await assistant.route({method:'POST',body:{message:'Write a caption'}},new URL('http://localhost/api/assistant/chat'),{id:'test-user',email_verified:1,email:'private-email'});assert.equal(result.reply,'Your next adventure starts here.');assert.equal(requests,1);globalThis.fetch=async()=>Response.json({status:'incomplete',output:[]});await assert.rejects(()=>assistant.route({method:'POST',body:{message:'Try again'}},new URL('http://localhost/api/assistant/chat'),{id:'test-user',email_verified:1}),{status:502});}
 finally{globalThis.fetch=original;for(const [name,value] of [['OPENAI_API_KEY',oldKey],['CHAT_ASSISTANT_ENABLED',oldEnabled],['CHAT_ASSISTANT_MODEL',oldModel]]){if(value===undefined)delete process.env[name];else process.env[name]=value;}db.close();}
});
