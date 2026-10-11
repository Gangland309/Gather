import test from 'node:test';
import assert from 'node:assert/strict';
import {postLinks} from '../mobile/post-links.mjs';
test('post links normalize www and remove sentence punctuation',()=>{
 const text='See https://example.com/path, http://example.org and (www.example.net).';
 assert.deepEqual(postLinks(text).map(x=>x.url),['https://example.com/path','http://example.org/','https://www.example.net/']);
 assert.deepEqual(postLinks(text).map(x=>text.slice(x.start,x.end)),['https://example.com/path','http://example.org','www.example.net']);
});
test('links retain balanced URL parentheses and reject credentials and unsafe schemes',()=>{
 assert.equal(postLinks('https://example.com/a_(b).')[0].url,'https://example.com/a_(b)');
 assert.deepEqual(postLinks('javascript:alert(1) https://user:pass@example.com https://'),[]);
});
