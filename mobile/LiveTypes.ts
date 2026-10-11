export type LiveConnection={id?:string;url:string;token:string;canPublish:boolean;endToken?:string;audioOnly?:boolean;privateRoom?:boolean};
export type LiveComment={id:number;body:string;author:{id:string;username:string}};

export type LiveGiftEvent={id:number;recipientId:string;recipientRole?:'speaker'|'audience';recipientUsername:string;senderUsername:string;mode:'gc'|'test';createdAt:string;gift:{id:string;name:string;symbol:string;priceGC:number;animation?:string}};
export type LiveGiftTotals={gc:{amount:string;count:number};test:{amount:string;count:number};recipients:{id:string;username:string;mode:'gc'|'test';amount:string;count:number}[]};
export type LiveBattle={id:string;status:'pending'|'active'|'finished'|'cancelled'|'expired'|'declined';mode:'gc'|'test';multiplier:number;duration:number;createdAt:number;startsAt:number|null;endsAt:number|null;winnerId:string|null;reason:string|null;challenger:{id:string;username:string;points:string};opponent:{id:string;username:string;points:string}};
export type LiveGiftFeed={events:LiveGiftEvent[];totals?:LiveGiftTotals;battle?:LiveBattle|null;clockOffset:number;error?:string};
