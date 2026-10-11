import React,{useEffect,useRef,useState} from 'react';
import {externalMedia} from './external-media.mjs';
import {Player} from './VideoPost.web';

export function ExternalMedia({url,thumbnail,title}:{url:string;thumbnail?:string|null;title?:string}){
 const media=externalMedia(url),[playing,setPlaying]=useState(false),[error,setError]=useState(''),token=useRef({});
 useEffect(()=>{
  const stop=(event:Event)=>{if(event.type==='play'||(event as CustomEvent).detail!==token.current)setPlaying(false);};
  document.addEventListener('play',stop,true);document.addEventListener('gather-external-play',stop);
  return()=>{document.removeEventListener('play',stop,true);document.removeEventListener('gather-external-play',stop);};
 },[]);
 if(!media)return null;
 const start=()=>{
  document.querySelectorAll('video,audio').forEach(el=>(el as HTMLMediaElement).pause());
  document.dispatchEvent(new CustomEvent('gather-external-play',{detail:token.current}));setPlaying(true);
 };
 return <div style={{width:'100%',background:'#100d17',color:'#fff'}}>
  {media.kind==='video'?<Player source={{url:media.url,thumbnail:thumbnail||''}} height={300} onError={setError}/>:media.kind==='audio'?<audio src={media.url} controls preload="none" onPlay={()=>{document.querySelectorAll('video').forEach(el=>el.pause());document.dispatchEvent(new CustomEvent('gather-external-play'));}} style={{width:'100%'}}/>:playing?<><iframe title={title||'Linked media'} src={media.url} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen style={{width:'100%',height:300,border:0}}/><button onClick={()=>setPlaying(false)}>Stop linked video</button></>:<button onClick={start} style={{padding:16,width:'100%'}}>▶ Play linked video in Gather</button>}
  {error&&<p role="alert">{error} Use the original link below if the source blocks playback.</p>}
 </div>;
}
