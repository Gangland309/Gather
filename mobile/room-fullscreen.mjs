export function createRoomFullscreen(root,dialog,onChange){
 const doc=root.ownerDocument;let mode='inline',disposed=false,previous=null;
 const change=value=>{mode=value;if(!disposed)onChange(value);};
 const nativeChange=()=>{if(doc.fullscreenElement===root)change('native');else if(mode==='native')change('inline');};
 const fallback=()=>{if(disposed)return;try{dialog.close();dialog.showModal();change('expanded');}catch{dialog.setAttribute('open','');change('expanded');}};
 async function enter(){if(disposed||mode!=='inline')return;previous=doc.activeElement;if(root.requestFullscreen){try{await root.requestFullscreen();if(disposed){if(doc.fullscreenElement===root)await doc.exitFullscreen();return;}change('native');return;}catch{/* Use the in-app full-window view if browser fullscreen is unavailable. */}}fallback();}
 async function exit(){if(mode==='native'&&doc.fullscreenElement===root){try{await doc.exitFullscreen();}catch{return;}}if(mode==='expanded'){dialog.close();dialog.show();}change('inline');previous?.focus?.();}
 const cancel=event=>{if(mode==='expanded'){event.preventDefault();void exit();}};
 doc.addEventListener('fullscreenchange',nativeChange);dialog.addEventListener('cancel',cancel);
 return {enter,exit,dispose(){disposed=true;doc.removeEventListener('fullscreenchange',nativeChange);dialog.removeEventListener('cancel',cancel);if(mode==='expanded')dialog.close();if(doc.fullscreenElement===root)void doc.exitFullscreen().catch(()=>{});}};
}
