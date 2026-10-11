export function createRoomFullscreen(root:HTMLElement,dialog:HTMLDialogElement,onChange:(mode:'inline'|'native'|'expanded')=>void):{enter:()=>Promise<void>;exit:()=>Promise<void>;dispose:()=>void};
