export function normalizeApiOrigin(value:string):string{return value.trim().replace(/\/+$/,'').replace(/\/api$/,'');}
export async function readApiResponse(response:Response,path:string):Promise<unknown>{
 const body=await response.text(),type=response.headers.get('content-type')||'';
 if(!/application\/(?:[a-z0-9.-]+\+)?json\b/i.test(type))throw new Error(`Gather could not load ${path}: the server returned ${body.trimStart().startsWith('<')?'a web page':'an unexpected response'} instead of data (HTTP ${response.status}). Retry; if it continues, share this message with Gather support.`);
 let result:unknown;try{result=JSON.parse(body);}catch{throw new Error(`Gather received invalid data for ${path} (HTTP ${response.status}). Retry; if it continues, contact Gather support.`);}
 if(!response.ok){const error=result&&typeof result==='object'&&'error' in result?(result as {error:unknown}).error:null;throw Object.assign(new Error(typeof error==='string'?error:`Gather request ${path} failed (HTTP ${response.status}).`),{status:response.status});}
 return result;
}
