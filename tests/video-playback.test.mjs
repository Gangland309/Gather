import test from 'node:test';
import assert from 'node:assert/strict';
import {coordinateVideoPlayback,hoverVideoPlayback} from '../mobile/video-playback.mjs';
class Video extends EventTarget{
 tagName='VIDEO';muted=false;paused=true;plays=0;
 play(){this.paused=false;this.plays++;return Promise.resolve();}
 pause(){this.paused=true;}
}
test('starting a video pauses every other video, including manual playback',()=>{
 const doc=new EventTarget(),a=new Video(),b=new Video(),c=new Video();
 doc.querySelectorAll=()=>[a,b,c];const stop=coordinateVideoPlayback(doc);
 a.play();b.play();const event=new Event('play');Object.defineProperty(event,'target',{value:b});doc.dispatchEvent(event);
 assert.equal(a.paused,true);assert.equal(b.paused,false);assert.equal(c.paused,true);stop();
});
test('hover starts muted playback and leaving pauses it',async()=>{
 const video=new Video(),stop=hoverVideoPlayback(video);video.dispatchEvent(new Event('mouseenter'));await Promise.resolve();
 assert.equal(video.paused,false);assert.equal(video.muted,true);
 video.dispatchEvent(new Event('mouseleave'));assert.equal(video.paused,true);stop();
 video.dispatchEvent(new Event('mouseenter'));assert.equal(video.plays,1);
});
test('a delayed play completion cannot keep playing after pointer leaves',async()=>{
 const video=new Video();let resolve;video.play=()=>new Promise(r=>{resolve=()=>{video.paused=false;r();};});
 const stop=hoverVideoPlayback(video);video.dispatchEvent(new Event('mouseenter'));video.dispatchEvent(new Event('mouseleave'));resolve();await Promise.resolve();
 assert.equal(video.paused,true);stop();
});
test('browser autoplay rejection is handled and manual controls remain available',async()=>{
 const video=new Video();video.play=()=>Promise.reject(new Error('NotAllowedError'));const stop=hoverVideoPlayback(video);
 video.dispatchEvent(new Event('mouseenter'));await Promise.resolve();await Promise.resolve();assert.equal(video.paused,true);stop();
});
