import React,{createContext,useContext} from 'react';
import {Pressable,type StyleProp,type ViewStyle} from 'react-native';
export const ProfileNavigation=createContext<(id:string)=>void>(()=>{});
export function ProfileLink({id,name,children,style}:{id:string;name:string;children:React.ReactNode;style?:StyleProp<ViewStyle>}){
 const open=useContext(ProfileNavigation);
 return <Pressable accessibilityRole="button" accessibilityLabel={`View ${name}'s profile`} onPress={event=>{event.stopPropagation();open(id);}} style={({pressed})=>[style,{opacity:pressed?.7:1}]}>{children}</Pressable>;
}
