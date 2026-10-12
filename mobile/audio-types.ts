export type AudioInfo={id:string;title:string;kind:'music'|'audiobook';duration:number;size:number;coverUrl?:string|null;url:string};
export type AudioApi=<T>(path:string,method?:string,data?:unknown)=>Promise<T>;
export function audioTime(seconds:number){const n=Math.max(0,Math.floor(seconds||0));return n>=3600?`${Math.floor(n/3600)}:${String(Math.floor(n/60)%60).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`:`${Math.floor(n/60)}:${String(n%60).padStart(2,'0')}`;}
