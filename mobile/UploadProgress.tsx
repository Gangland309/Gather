import {ThemeView as View} from './Theme';
import React from 'react';
import {} from 'react-native';
import {useTheme,ThemeText as Text} from './Theme';
export function UploadProgress({percent,stage}:{percent:number;stage:string}){
 const {colors}=useTheme();const value=Math.min(100,Math.max(0,Number.isFinite(percent)?percent:0));
 return <View style={{gap:8}}><View style={{flexDirection:'row',justifyContent:'space-between',gap:12}}><Text style={{flex:1,fontWeight:'600'}}>{stage}</Text><Text style={{fontWeight:'700'}}>{value}%</Text></View><View accessibilityRole="progressbar" accessibilityLabel="Video upload progress" accessibilityValue={{min:0,max:100,now:value,text:`${value}% · ${stage}`}} style={{height:14,borderRadius:7,overflow:'hidden',backgroundColor:colors.tint,borderWidth:1,borderColor:colors.line}}><View style={{height:'100%',width:`${value}%`,backgroundColor:colors.accent}}/></View></View>;
}
