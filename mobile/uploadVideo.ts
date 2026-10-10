import {Platform} from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import type {ImagePickerAsset} from 'expo-image-picker';
export async function videoSize(asset:ImagePickerAsset){
 let size=asset.fileSize||asset.file?.size;
 if(!size){if(Platform.OS==='web'){const response=await fetch(asset.uri);if(!response.ok)throw new Error('Could not read the selected video. Select it again.');size=(await response.blob()).size;}else{const info=await FileSystem.getInfoAsync(asset.uri);if(info.exists&&!info.isDirectory)size=info.size;}}
 if(!size)throw new Error('Could not read the video size. Save it on this device and select it again.');
 if(size>104857600)throw new Error('Choose a video up to 100 MB.');
 return size;
}
export async function uploadVideo(asset:ImagePickerAsset,url:string,progress:(percent:number)=>void){
 progress(0);
 if(Platform.OS==='web'){
 const blob=asset.file||await (await fetch(asset.uri)).blob();
 await new Promise<void>((resolve,reject)=>{const xhr=new XMLHttpRequest();xhr.open('PUT',url);xhr.timeout=600000;let lastProgress=Date.now();const stalled=setInterval(()=>{if(Date.now()-lastProgress>45000){clearInterval(stalled);xhr.onabort=null;xhr.abort();reject(new Error('Video transfer made no progress for 45 seconds. Check your connection and the Gather upload-origin configuration. Retry the upload.'));}},5000);xhr.onloadend=()=>clearInterval(stalled);
 xhr.upload.onprogress=e=>{lastProgress=Date.now();if(e.lengthComputable)progress(Math.round(e.loaded/e.total*100));};
 xhr.onload=()=>xhr.status>=200&&xhr.status<300?resolve():reject(new Error(`Video transfer failed (HTTP ${xhr.status}). Try uploading again; the upload link may have expired.`));
 xhr.onerror=()=>reject(new Error('Video transfer could not connect. Check your internet connection. If it persists, the Gather operator must check Mux upload CORS against the site address.'));
 xhr.ontimeout=()=>reject(new Error('Video upload timed out. Try a smaller video or a faster connection.'));
 xhr.onabort=()=>reject(new Error('Video upload was interrupted. Try uploading again.'));xhr.send(blob);});
 }else{const task=FileSystem.createUploadTask(url,asset.uri,{httpMethod:'PUT',uploadType:FileSystem.FileSystemUploadType.BINARY_CONTENT},e=>{if(e.totalBytesExpectedToSend>0)progress(Math.round(e.totalBytesSent/e.totalBytesExpectedToSend*100));});const r=await task.uploadAsync();if(!r||r.status<200||r.status>=300)throw new Error(`Video transfer failed${r?` (HTTP ${r.status})`:''}. Check your connection and try uploading again.`);}
 progress(100);
}
