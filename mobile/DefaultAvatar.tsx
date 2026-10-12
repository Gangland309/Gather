import {useTheme,ThemeText as Text} from './Theme';
import React from 'react';
import {View} from 'react-native';
export default function DefaultAvatar({size=42,name='Gather member'}:{size?:number;name?:string}){const {colors}=useTheme();return <View accessible accessibilityLabel={`${name}'s default Gather G profile picture`} style={{width:size,height:size,borderRadius:size/2,backgroundColor:colors.tint,borderWidth:1,borderColor:colors.line,alignItems:'center',justifyContent:'center'}}><Text style={{color:colors.ink,fontSize:size*.56,lineHeight:size*.7,fontWeight:'800',letterSpacing:-size*.035}}>G</Text><View style={{position:'absolute',bottom:size*.16,right:size*.19,width:size*.1,height:size*.1,borderRadius:size*.05,backgroundColor:colors.accent}}/></View>;}
