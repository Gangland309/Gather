import React,{useEffect,useState} from 'react';
import {View,Pressable,Image} from 'react-native';
import {useTheme,ThemeText as Text} from './Theme';
type Api=<T>(path:string,method?:string,data?:unknown)=>Promise<T>;
export type FeedLive={id:string;title:string;thumbnail?:string|null;host:{id:string;username:string};guestIds:string[]};
export function useLiveFeed(api:Api,enabled:boolean){
 const [lives,setLives]=useState<FeedLive[]>([]),[error,setError]=useState('');
 useEffect(()=>{setLives([]);setError('');if(!enabled)return;let alive=true,inFlight=false;
 async function load(){if(inFlight)return;inFlight=true;try{const list=await api<FeedLive[]>('/live?kind=live');if(alive){setLives(list);setError('');}}catch(e){if(alive)setError(e instanceof Error?e.message:'Unable to refresh live broadcasts.');}finally{inFlight=false;}}
 void load();const timer=setInterval(()=>void load(),10000);return()=>{alive=false;clearInterval(timer);};
 },[api,enabled]);return {lives,error};
}
export function LiveFeedCard({live,onWatch}:{live:FeedLive;onWatch:()=>void}){const {colors}=useTheme();return <View style={{padding:20,gap:12,borderRadius:4,borderWidth:1,borderColor:colors.accent,backgroundColor:colors.surface}}><Pressable accessibilityRole="button" accessibilityLabel={`Watch ${live.title} live preview`} onPress={onWatch}><Image accessibilityLabel={live.thumbnail?'Recent live camera snapshot':'Gather live placeholder'} source={live.thumbnail?{uri:live.thumbnail}:require('./assets/gather-logo.png')} resizeMode="contain" style={{width:'100%',aspectRatio:16/9,backgroundColor:'#000000',borderRadius:4}}/><Text style={{color:colors.muted,fontSize:12}}>{live.thumbnail?'Recent live snapshot':'Live preview unavailable · tap to watch'}</Text></Pressable><Text style={{color:colors.red,fontWeight:'800'}}>● LIVE NOW</Text><Text style={{fontSize:22,fontWeight:'700'}}>{live.title}</Text><Text>@{live.host.username} · {1+live.guestIds.length} broadcasting</Text><Pressable accessibilityRole="button" accessibilityLabel={`Watch ${live.title} live`} onPress={onWatch} style={{padding:14,minHeight:48,borderRadius:4,backgroundColor:colors.accent}}><Text style={{color:colors.dark,fontWeight:'700'}}>Watch live →</Text></Pressable></View>;}
