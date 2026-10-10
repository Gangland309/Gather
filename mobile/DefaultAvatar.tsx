import React from 'react';
import {Image} from 'react-native';
export default function DefaultAvatar({size=42,name='Gather member'}:{size?:number;name?:string}){return <Image source={require('./assets/gather-default-avatar.png')} accessibilityLabel={`${name}'s default Gather G profile picture`} resizeMode="contain" style={{width:size,height:size,borderRadius:size/2,backgroundColor:'#fff',borderWidth:1,borderColor:'#dedce8'}}/>;}
