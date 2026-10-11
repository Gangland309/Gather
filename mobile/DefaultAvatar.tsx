import {useTheme} from './Theme';
import React from 'react';
import {Image} from 'react-native';
export default function DefaultAvatar({size=42,name='Gather member'}:{size?:number;name?:string}){const {colors}=useTheme();return <Image source={require('./assets/gather-default-avatar.png')} accessibilityLabel={`${name}'s default Gather G profile picture`} resizeMode="contain" style={{width:size,height:size,borderRadius:size/2,backgroundColor:colors.surface,borderWidth:1,borderColor:colors.line}}/>;}
