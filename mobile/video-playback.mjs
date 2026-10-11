// Coordinate all HTML videos, including playback from native controls.
const coordinators=new WeakMap();
export function coordinateVideoPlayback(document){
 let state=coordinators.get(document);
 if(!state){
  const onPlay=event=>{
   const active=event.target;
   if(active?.tagName!=='VIDEO')return;
   document.dispatchEvent(new Event('gather-external-play'));
   for(const video of document.querySelectorAll('video,audio'))if(video!==active&&!video.paused)video.pause();
  };
  state={users:0,onPlay};coordinators.set(document,state);
  document.addEventListener('play',onPlay,true);
 }
 state.users++;
 let released=false;
 return ()=>{
  if(released)return;released=true;
  if(--state.users===0){document.removeEventListener('play',state.onPlay,true);coordinators.delete(document);}
 };
}
export function hoverVideoPlayback(video){
 let hovering=false,disposed=false;
 const enter=()=>{
  hovering=true;
  video.muted=true;
  const attempt=video.play();
  if(attempt?.then)void attempt.then(()=>{if(!hovering||disposed)video.pause();}).catch(()=>{});
 };
 const leave=()=>{hovering=false;video.pause();};
 video.addEventListener('mouseenter',enter);
 video.addEventListener('mouseleave',leave);
 return ()=>{disposed=true;leave();video.removeEventListener('mouseenter',enter);video.removeEventListener('mouseleave',leave);};
}

export function startVideoAutoplay(video,onBlocked=()=>{}){
 let disposed=false,started=false,pending=false;
 video.muted=true;
 const attempt=()=>{
  if(disposed||started||pending||video.readyState<2)return;
  pending=true;
  try{Promise.resolve(video.play()).then(()=>{pending=false;if(!disposed){started=true;onBlocked(false);}}).catch(()=>{pending=false;if(!disposed)onBlocked(true);});}
  catch{pending=false;if(!disposed)onBlocked(true);}
 };
 video.addEventListener('loadeddata',attempt);video.addEventListener('canplay',attempt);attempt();
 return()=>{disposed=true;video.removeEventListener('loadeddata',attempt);video.removeEventListener('canplay',attempt);};
}
