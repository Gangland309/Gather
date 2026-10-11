export function postLinks(body){
 const links=[];
 for(const match of body.matchAll(/\b(?:https?:\/\/|www\.)[^\s<>]+/gi)){
  let label=match[0].replace(/[.,!?;:]+$/,'');
  for(const [open,close] of [['(',')'],['[',']'],['{','}']]){
   while(label.endsWith(close)&&label.split(close).length>label.split(open).length)label=label.slice(0,-1);
  }
  try{const url=new URL(/^www\./i.test(label)?`https://${label}`:label);
   if(['http:','https:'].includes(url.protocol)&&url.hostname&&!url.username&&!url.password)links.push({start:match.index,end:match.index+label.length,url:url.href});
  }catch{}
 }
 return links;
}
