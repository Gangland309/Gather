export function coordinateVideoPlayback(document:Document):()=>void;
export function hoverVideoPlayback(video:HTMLVideoElement):()=>void;

export function startVideoAutoplay(video:HTMLVideoElement,onBlocked?:(blocked:boolean)=>void):()=>void;

export function pauseOffscreenVideo(video:HTMLVideoElement,Observer?:typeof IntersectionObserver):()=>void;

export function playVideoFromGesture(video:HTMLVideoElement,onError?:(message:string)=>void):Promise<void>;
