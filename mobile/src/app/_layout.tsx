import React from 'react';
import { Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {View,Text,Pressable} from 'react-native';
class AppBoundary extends React.Component<{children:React.ReactNode},{failed:boolean}>{state={failed:false};static getDerivedStateFromError(){return {failed:true};}render(){if(this.state.failed)return <View style={{flex:1,justifyContent:'center',padding:24,gap:16,backgroundColor:'#f3f4f6'}}><Text style={{color:'#17212f',fontSize:22,fontWeight:'600'}}>Gather couldn’t show this screen.</Text><Text style={{color:'#596575'}}>Try again. If this keeps happening, contact Gather support and describe which screen you opened.</Text><Pressable accessibilityRole="button" onPress={()=>this.setState({failed:false})} style={{padding:14,backgroundColor:'#e8edf2',borderRadius:6}}><Text style={{color:'#17212f'}}>Try again</Text></Pressable></View>;return this.props.children;}}
export default function Layout(){return <SafeAreaProvider><AppBoundary><Slot/></AppBoundary></SafeAreaProvider>;}
