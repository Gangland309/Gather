import React,{useEffect,useMemo,useState} from 'react';
import {Image,Linking,Pressable,View} from 'react-native';
import {ThemeText as Text,useTheme} from './Theme';
import {postLinks} from './post-links.mjs';
type Preview={url:string;domain:string;title:string;description:string;image:string|null};
export function LinkPreviews({postId,body,api}:{postId:number;body:string;api:<T>(path:string,method?:string,data?:unknown)=>Promise<T>}){
 const {colors}=useTheme(),[previews,setPreviews]=useState<Preview[]>([]);
 const hasLinks=useMemo(()=>postLinks(body).length>0,[body]);
 useEffect(()=>{let active=true;setPreviews([]);if(hasLinks)void api<{previews:Preview[]}>(`/posts/${postId}/link-previews`).then(result=>{if(active)setPreviews(result.previews);}).catch(()=>{});return()=>{active=false;};},[api,postId,body,hasLinks]);
 if(!previews.length)return null;
 return <View style={{gap:12}}>{previews.map(preview=><Pressable key={preview.url} accessibilityRole="link" accessibilityLabel={`Open ${preview.title||preview.domain}`} onPress={()=>void Linking.openURL(preview.url).catch(()=>{})} style={{borderWidth:1,borderColor:colors.line,borderRadius:10,overflow:'hidden',backgroundColor:colors.surface}}>
  {preview.image&&<Image source={{uri:preview.image}} accessibilityLabel={preview.title||`${preview.domain} link thumbnail`} resizeMode="cover" style={{width:'100%',height:180,backgroundColor:colors.tint}}/>}
  <View style={{padding:14,gap:6}}><Text style={{fontSize:12,color:colors.muted}}>{preview.domain}</Text><Text numberOfLines={2} style={{fontWeight:'700',fontSize:17,color:colors.ink}}>{preview.title||preview.domain}</Text>{!!preview.description&&<Text numberOfLines={2} style={{fontSize:13,lineHeight:20,color:colors.muted}}>{preview.description}</Text>}</View>
 </Pressable>)}</View>;
}
