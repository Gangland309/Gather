export type Point={x:number;y:number};
export function wrap(x:number):number;
export function project(lat:number,lon:number):Point;
export function offset(point:Point,center:Point,zoom:number):Point;
export function pan(center:Point,dx:number,dy:number,zoom:number):Point;
export function tiles(center:Point,zoom:number,width:number,height:number):{key:string;x:number;y:number;left:number;top:number}[];
