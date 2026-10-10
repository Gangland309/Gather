import {useTheme,ThemeText as Text,ThemeInput as TextInput} from './Theme';
import React from 'react';
import {Linking,Pressable,View} from 'react-native';
export default function LiveTransport({connection}:{connection:{token:string;url:string;canPublish:boolean}}){const origin=process.env.EXPO_PUBLIC_SITE_URL||'https://gatherourworld.com';return <View style={{gap:12}}><Text>This release opens live camera and microphone in your phone’s browser. Keep this screen available to manage the broadcast.</Text><Pressable onPress={()=>Linking.openURL(`${origin}/#liveToken=${encodeURIComponent(connection.token)}&liveUrl=${encodeURIComponent(connection.url)}&publish=${connection.canPublish?'1':'0'}`)}><Text style={{color:'#6326d9'}}>Open live broadcast</Text></Pressable></View>;}
