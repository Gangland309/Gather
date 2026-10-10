// Secrets and action tokens never appear in API responses or application logs.
export const mailConfigured = !!(process.env.RESEND_API_KEY && process.env.EMAIL_FROM && process.env.PUBLIC_ORIGIN);
let transport = null;
export function setTestMailTransport(fn) {
 if (process.env.NODE_ENV !== 'test') throw new Error('Test transport is disabled.');
 transport = fn;
}
export async function sendAction(email, kind, token) {
 if (!mailConfigured && !transport) throw new Error('Email delivery is not configured.');
 const origin = new URL(process.env.PUBLIC_ORIGIN || 'http://localhost:8787');
 if (process.env.NODE_ENV === 'production' && origin.protocol !== 'https:') throw new Error('Use an HTTPS public origin.');
 const link = new URL('/', origin);
 // Fragment keeps the token out of server request logs and Referer headers.
 link.hash = new URLSearchParams({action:kind, token}).toString();
 const verify = kind === 'verify';
 const subject = verify ? 'Verify your Gather email' : 'Reset your Gather password';
 const text = `${subject}\n\n${link.href}\n\nThis link expires in ${verify ? '24 hours' : '30 minutes'} and works once. If you did not request it, ignore this email.`;
 const message = {from:process.env.EMAIL_FROM,to:[email],subject,text};
 if (transport) return transport(message);
 const response = await fetch('https://api.resend.com/emails', {method:'POST',headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify(message),signal:AbortSignal.timeout(10000)});
 if (!response.ok) throw new Error('Email provider rejected delivery.');
}
