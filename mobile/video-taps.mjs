export function createVideoTaps(single,double,schedule=setTimeout,cancel=clearTimeout){
 let pending=null;
 return {tap(){if(pending!==null){cancel(pending);pending=null;double();}else pending=schedule(()=>{pending=null;single();},280);},dispose(){if(pending!==null)cancel(pending);pending=null;}};
}
