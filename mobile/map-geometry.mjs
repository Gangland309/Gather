export const wrap=x=>((x%1)+1)%1;
export function project(lat,lon){const a=Math.max(-85.05112878,Math.min(85.05112878,lat))*Math.PI/180;return {x:wrap((lon+180)/360),y:Math.max(0,Math.min(1,(1-Math.log(Math.tan(a)+1/Math.cos(a))/Math.PI)/2))};}
export function offset(point,center,zoom){const world=256*2**zoom;let dx=point.x-center.x;dx-=Math.round(dx);return {x:dx*world,y:(point.y-center.y)*world};}
export function pan(center,dx,dy,zoom){const world=256*2**zoom;return {x:wrap(center.x-dx/world),y:Math.max(0,Math.min(1,center.y-dy/world))};}
export function tiles(center,zoom,width,height){const n=2**zoom,cx=center.x*n*256,cy=center.y*n*256,result=[];for(let y=Math.max(0,Math.floor((cy-height/2)/256));y<=Math.min(n-1,Math.floor((cy+height/2)/256));y++)for(let x=Math.floor((cx-width/2)/256);x<=Math.floor((cx+width/2)/256);x++)result.push({key:`${x}/${y}`,x:((x%n)+n)%n,y,left:x*256-cx+width/2,top:y*256-cy+height/2});return result;}
