import {useTheme,ThemeText as Text,ThemeInput as TextInput} from './Theme';
import React,{useEffect,useState} from 'react';
import {View,Image} from 'react-native';
import {useVideoPlayer,VideoView} from 'expo-video';
function Player({url,height=300}:{url:string;height?:number}){const player=useVideoPlayer({uri:url,contentType:'hls'});return <VideoView player={player} nativeControls style={{width:'100%',height}} fullscreenOptions={{enable:true}}/>;}
export function VideoPost({id,api,height=300,immersive=false}:{height?:number;immersive?:boolean;id:string;api:<T>(path:string,method?:string,data?:unknown)=>Promise<T>}){const [video,setVideo]=useState<{url:string;thumbnail:string}|null>(null),[error,setError]=useState('');useEffect(()=>{let active=true;api<{url:string;thumbnail:string}>(`/videos/${id}`).then(v=>{if(active)setVideo(v);}).catch(e=>{if(active)setError(e.message);});return()=>{active=false;};},[id,api]);return <View>{video?<>{!immersive&&<Image source={{uri:video.thumbnail}} style={{width:'100%',height:100}} accessibilityLabel="Video thumbnail"/>}<Player url={video.url} height={height}/></>:<Text>{error||'Loading video…'}</Text>}</View>;}
