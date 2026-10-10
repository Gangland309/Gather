export type LiveConnection={id?:string;url:string;token:string;canPublish:boolean;endToken?:string;audioOnly?:boolean;privateRoom?:boolean};
export type LiveComment={id:number;body:string;author:{id:string;username:string}};

export type LiveGiftEvent={id:number;recipientId:string;recipientUsername:string;senderUsername:string;mode:'gc'|'test';createdAt:string;gift:{id:string;name:string;symbol:string;priceGC:number;animation?:string}};
