import test from 'node:test';
import assert from 'node:assert/strict';
import {coordinateVideoPlayback,hoverVideoPlayback,startVideoAutoplay,pauseOffscreenVideo} from '../mobile/video-playback.mjs';
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

test('Spark autoplay waits for asynchronous media readiness and starts only once',async()=>{
 const video=new Video();video.readyState=0;const states=[],stop=startVideoAutoplay(video,b=>states.push(b));assert.equal(video.plays,0);assert.equal(video.muted,true);
 video.readyState=2;video.dispatchEvent(new Event('canplay'));await Promise.resolve();assert.equal(video.plays,1);video.pause();video.dispatchEvent(new Event('canplay'));assert.equal(video.plays,1);assert.deepEqual(states,[false]);stop();
});
test('blocked Spark autoplay enables fallback and cleanup prevents late updates',async()=>{
 const video=new Video();video.readyState=2;video.play=()=>Promise.reject(new Error('NotAllowedError'));const states=[],stop=startVideoAutoplay(video,b=>states.push(b));await Promise.resolve();await Promise.resolve();assert.deepEqual(states,[true]);stop();video.dispatchEvent(new Event('canplay'));await Promise.resolve();assert.deepEqual(states,[true]);
});

test('scrolling a video offscreen pauses it and blocks late playback without restarting on return',()=>{
 const video=new Video();let callback,disconnected=false;
 class Observer{constructor(cb){callback=cb;}observe(target){assert.equal(target,video);}disconnect(){disconnected=true;}}
 const stop=pauseOffscreenVideo(video,Observer);video.play();callback([{target:video,isIntersecting:false,intersectionRatio:0}]);assert.equal(video.paused,true);
 video.play();video.dispatchEvent(new Event('play'));assert.equal(video.paused,true);
 callback([{target:video,isIntersecting:true,intersectionRatio:1}]);assert.equal(video.paused,true);
 video.play();video.dispatchEvent(new Event('play'));assert.equal(video.paused,false);
 stop();assert.equal(disconnected,true);
});
test('single tap waits for double-tap window; double tap likes once and cancels fullscreen',async()=>{
 const {createVideoTaps}=await import('../mobile/video-taps.mjs');let single=0,double=0,callback,canceled=0;
 const taps=createVideoTaps(()=>single++,()=>double++,fn=>{callback=fn;return 1;},()=>canceled++);
 taps.tap();assert.equal(single,0);callback();assert.equal(single,1);
 taps.tap();taps.tap();assert.equal(single,1);assert.equal(double,1);assert.equal(canceled,1);
 taps.tap();taps.dispose();assert.equal(canceled,2);
});
