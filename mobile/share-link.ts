import {Platform,Share} from 'react-native';
import * as Clipboard from 'expo-clipboard';
export async function copyGatherLink(url:string){await Clipboard.setStringAsync(url);}
export async function shareGatherLink(url:string,title='Gather',text=''){try{if(Platform.OS==='web'){if(navigator.share){await navigator.share({title,text,url});return 'shared';}await copyGatherLink(url);return 'copied';}const result=await Share.share({title,message:`${text?text+'\n':''}${url}`,url});return result.action===Share.dismissedAction?'canceled':'shared';}catch(e){if(e instanceof Error&&e.name==='AbortError')return 'canceled';throw e;}}
