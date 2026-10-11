import {useEffect} from 'react';
import type {Room} from 'livekit-client';
import {Track} from 'livekit-client';
import type {LiveConnection} from './LiveTypes';
export function useLiveThumbnail(connection:LiveConnection,room:Room|null,camera:boolean){
 useEffect(()=>{if(connection.privateRoom||!connection.id||!connection.endToken||!room)return;let active=true,busy=false;const controller=new AbortController();
 async function update(){if(!active||busy||!room)return;busy=true;try{let image:string|null=null;const track=room.localParticipant.getTrackPublication(Track.Source.Camera)?.track;
 if(camera&&track&&!track.isMuted){const video=track.attachedElements.find((v):v is HTMLVideoElement=>v instanceof HTMLVideoElement&&v.readyState>=2&&v.videoWidth>0);if(video){const canvas=document.createElement('canvas');canvas.width=320;canvas.height=180;const ctx=canvas.getContext('2d');if(ctx){ctx.fillStyle='#000';ctx.fillRect(0,0,320,180);const scale=Math.min(320/video.videoWidth,180/video.videoHeight);ctx.drawImage(video,(320-video.videoWidth*scale)/2,(180-video.videoHeight*scale)/2,video.videoWidth*scale,video.videoHeight*scale);image=canvas.toDataURL('image/jpeg',.55);}}}
 const base=(process.env.EXPO_PUBLIC_API_URL||window.location.origin).replace(/\/+$/,'');await fetch(`${base}/api/live/${connection.id}/thumbnail`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({endToken:connection.endToken,image}),signal:controller.signal});
 }catch{/* Thumbnail failure must not interrupt a live broadcast. */}finally{busy=false;}}
 void update();const timer=setInterval(()=>void update(),15000);return()=>{active=false;controller.abort();clearInterval(timer);};
 },[connection,room,camera]);
}
