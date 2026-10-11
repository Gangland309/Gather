import React,{useEffect,useMemo,useRef,useState} from 'react';
import {Image,Linking,PanResponder,Platform,Pressable,View} from 'react-native';
import {ThemeText as Text,useTheme} from './Theme';
import {ProfileLink} from './ProfileLink';
import {project,offset,pan,tiles} from './map-geometry.mjs';
import {GatheringLocation} from './GatheringLocation';
type Api=<T>(path:string,method?:string,data?:unknown)=>Promise<T>;
export type MapShare={userId:string;username:string;latitude:number;longitude:number;accuracy:number|null;sharedAt:string;expiresAt:number};
export function SharedLocationMap({rows}:{rows:MapShare[]}){
 const {colors}=useTheme(),[loaded,setLoaded]=useState(false),[width,setWidth]=useState(300),[zoom,setZoom]=useState(12),[center,setCenter]=useState({x:.5,y:.5}),[drag,setDrag]=useState({x:0,y:0}),[selected,setSelected]=useState<string|null>(null),[now,setNow]=useState(Date.now()),[failed,setFailed]=useState(false);
 const current=useRef({center,zoom});current.current={center,zoom};
 const valid=rows.filter(r=>r.expiresAt>now&&Number.isFinite(r.latitude)&&Number.isFinite(r.longitude));
 const first=valid[0]?.userId, firstLat=valid[0]?.latitude, firstLon=valid[0]?.longitude;useEffect(()=>{if(firstLat!==undefined&&firstLon!==undefined)setCenter(project(firstLat,firstLon));setSelected(null);},[first,firstLat,firstLon]);
 useEffect(()=>{const timer=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(timer);},[]);
 const gesture=useMemo(()=>PanResponder.create({onMoveShouldSetPanResponder:(_,g)=>Math.abs(g.dx)+Math.abs(g.dy)>8,onPanResponderMove:(_,g)=>setDrag({x:g.dx,y:g.dy}),onPanResponderRelease:(_,g)=>{setCenter(pan(current.current.center,g.dx,g.dy,current.current.zoom));setDrag({x:0,y:0});},onPanResponderTerminate:()=>setDrag({x:0,y:0})}),[]);
 const member=valid.find(r=>r.userId===selected);
 const button=(label:string,run:()=>void)=><Pressable accessibilityRole="button" onPress={run} style={{padding:12,borderRadius:4,borderWidth:1,borderColor:colors.line,backgroundColor:colors.surface}}><Text>{label}</Text></Pressable>;
 return <View style={{gap:10}}><Text>Only voluntarily shared, unexpired locations of approved members appear. Locations are snapshots.</Text>{!loaded?<><Text>Load the map to contact OpenStreetMap for map tiles. The provider receives your IP address and viewed map area. Gather draws member names and pins locally.</Text>{button('Load in-app map',()=>setLoaded(true))}</>:<><View onLayout={e=>setWidth(Math.min(750,e.nativeEvent.layout.width))} style={{height:340,overflow:'hidden',borderRadius:4,backgroundColor:colors.tint}} {...gesture.panHandlers}>
 <View pointerEvents="none" style={{position:'absolute',left:drag.x,top:drag.y,width,height:340}}>{tiles(center,zoom,width,340).map(t=><Image key={`${zoom}/${t.key}`} source={{uri:`https://tile.openstreetmap.org/${zoom}/${t.x}/${t.y}.png`,...(Platform.OS!=='web'?{headers:{'User-Agent':'Gather/0.9.5 (+https://gatherourworld.com)'}}:{})}} onError={()=>setFailed(true)} style={{position:'absolute',left:t.left,top:t.top,width:256,height:256}}/>)}</View>
 {valid.map(r=>{const p=offset(project(r.latitude,r.longitude),center,zoom),left=width/2+p.x+drag.x,top=170+p.y+drag.y;if(left<0||left>width||top<0||top>340)return null;return <Pressable key={r.userId} accessibilityRole="button" accessibilityLabel={`Location of ${r.username}`} onPress={()=>setSelected(r.userId)} style={{position:'absolute',left:Math.max(0,Math.min(width-112,left-56)),top:Math.max(0,top-20),padding:8,borderRadius:4,backgroundColor:colors.surface,borderWidth:2,borderColor:colors.accent,maxWidth:112}}><Text numberOfLines={1}>● @{r.username}</Text></Pressable>;})}
 </View><View style={{flexDirection:'row',gap:8,flexWrap:'wrap'}}>{button('− Zoom out',()=>{setFailed(false);setZoom(v=>Math.max(2,v-1));})}{button('+ Zoom in',()=>{setFailed(false);setZoom(v=>Math.min(17,v+1));})}{button('© OpenStreetMap contributors',()=>void Linking.openURL('https://www.openstreetmap.org/copyright'))}</View>{failed&&<Text>Some map tiles could not load. Shared member details are still available below.</Text>}<Text>Drag to move the map. Tap a pin or center on a member below.</Text></>}
 {member&&<View style={{padding:12,borderWidth:1,borderColor:colors.accent,borderRadius:4}}><ProfileLink id={member.userId} name={member.username}><Text>@{member.username} · Open profile</Text></ProfileLink><Text>Shared {new Date(member.sharedAt).toLocaleTimeString()} · expires {new Date(member.expiresAt).toLocaleTimeString()}{member.accuracy!==null?` · accuracy about ${Math.round(member.accuracy)} m`:''}</Text></View>}
 {valid.map(r=><View key={r.userId}>{button(`Center on @${r.username}`,()=>{setCenter(project(r.latitude,r.longitude));setSelected(r.userId);})}</View>)}{!valid.length&&<Text>No active shared locations.</Text>}
 </View>;
}
export function GatheringMap({api,userId}:{api:Api;userId:string}){
 const [groups,setGroups]=useState<{id:number;name:string;membership:string}[]>([]),[chosen,setChosen]=useState<number|null>(null),[error,setError]=useState('');const {colors}=useTheme();
 useEffect(()=>{let active=true;api<typeof groups>('/gatherings?mine=true').then(g=>{if(active)setGroups(g.filter(v=>v.membership==='approved'));}).catch(e=>{if(active)setError(e.message);});return()=>{active=false;};},[api]);
 return <View style={{gap:14}}><Text>Choose a Gathering or Fan Club to view its member map.</Text>{!!error&&<Text>{error}</Text>}{groups.map(g=><Pressable key={g.id} accessibilityRole="button" onPress={()=>setChosen(g.id)} style={{padding:14,borderRadius:4,borderWidth:1,borderColor:chosen===g.id?colors.accent:colors.line}}><Text>{g.name}</Text></Pressable>)}{!groups.length&&!error&&<Text>Join a Gathering or Fan Club first.</Text>}{chosen&&<GatheringLocation key={chosen} api={api} groupId={chosen} userId={userId}/>}<GatheringLocation api={api} userId={userId}/></View>;
}
