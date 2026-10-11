import test from 'node:test';
import assert from 'node:assert/strict';
import {externalMedia} from '../mobile/external-media.mjs';
test('recognizes direct media including signed URLs',()=>{
 assert.equal(externalMedia('https://cdn.example/a.mp4?token=abc').kind,'video');
 assert.equal(externalMedia('https://cdn.example/a.m3u8').kind,'video');
 assert.equal(externalMedia('https://cdn.example/a.mp3').kind,'audio');
});
test('only embeds known provider hosts and validated identifiers',()=>{
 assert.match(externalMedia('https://youtu.be/M7lc1UVf-VE').url,/youtube.com\/embed\/M7lc1UVf-VE/);
 assert.equal(externalMedia('https://www.youtube.com/shorts/M7lc1UVf-VE').kind,'embed');
 assert.match(externalMedia('https://vimeo.com/12345').url,/player.vimeo.com\/video\/12345/);
 for(const url of ['javascript:alert(1)','https://youtube.com.evil.test/watch?v=M7lc1UVf-VE','https://youtube.com/watch?v=bad','https://example.com/article','http://example.com/a.mp4'])assert.equal(externalMedia(url),null);
});
