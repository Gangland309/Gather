// Only standalone handles count. Email addresses, URL paths and overlong handles do not.
export function mentionTokens(body){const result=[];const regex=/(^|[\s([{,:;!?])@([a-z0-9_]{3,24})(?![a-z0-9_]|\.[a-z0-9])/gi;for(const m of String(body||'').matchAll(regex))result.push({username:m[2].toLowerCase(),start:m.index+m[1].length,end:m.index+m[0].length});return result;}
