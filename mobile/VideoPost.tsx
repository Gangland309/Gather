import React,{useEffect,useState} from 'react';
import {Text,View,Image} from 'react-native';
import {useVideoPlayer,VideoView} from 'expo-video';
function Player({url}:{url:string}){const player=useVideoPlayer({uri:url,contentType:'hls'});return <VideoView player={player} nativeControls style={{width:'100%',height:300}} fullscreenOptions={{enable:true}}/>;}
export function VideoPost({id,api}:{id:string;api:<T>(path:string,method?:string,data?:unknown)=>Promise<T>}){const [video,setVideo]=useState<{url:string;thumbnail:string}|null>(null),[error,setError]=useState('');useEffect(()=>{let active=true;api<{url:string;thumbnail:string}>(`/videos/${id}`).then(v=>{if(active)setVideo(v);}).catch(e=>{if(active)setError(e.message);});return()=>{active=false;};},[id,api]);return <View>{video?<><Image source={{uri:video.thumbnail}} style={{width:'100%',height:100}} accessibilityLabel="Video thumbnail"/><Player url={video.url}/></>:<Text>{error||'Loading video…'}</Text>}</View>;}
