export function resolveSpeakerFocus(directorId:string|null|undefined,viewerId:string|null,available:string[]){return directorId|| (viewerId&&available.includes(viewerId)?viewerId:null);}
