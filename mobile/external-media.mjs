export function externalMedia(value){
 let url;try{url=new URL(value);}catch{return null;}
 if(url.protocol!=='https:'||url.username||url.password)return null;
 const host=url.hostname.toLowerCase(),path=url.pathname;
 if(/\.(mp4|webm|ogg|mov|m3u8)$/i.test(path))return {kind:'video',url:url.href};
 if(/\.(mp3|m4a|wav|oga)$/i.test(path))return {kind:'audio',url:url.href};
 if(['youtube.com','www.youtube.com','m.youtube.com','youtu.be'].includes(host)){
  const id=host==='youtu.be'?path.slice(1).split('/')[0]:url.searchParams.get('v')||path.match(/^\/(?:shorts|embed)\/([^/]+)/)?.[1];
  if(id&&/^[\w-]{11}$/.test(id))return {kind:'embed',url:`https://www.youtube.com/embed/${id}?autoplay=1&mute=1&playsinline=1`};
 }
 if(['vimeo.com','www.vimeo.com','player.vimeo.com'].includes(host)){
  const id=path.match(/^\/(?:video\/)?(\d+)\/?$/)?.[1];
  if(id)return {kind:'embed',url:`https://player.vimeo.com/video/${id}?autoplay=1&muted=1&playsinline=1`};
 }
 return null;
}
