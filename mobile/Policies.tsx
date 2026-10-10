import React from 'react';
import { Text, View } from 'react-native';
export const policies = {
 Privacy: [
  ['Gather privacy policy','Effective October 10, 2026. This notice describes the Gather features in this release.'],
  ['Information we collect','We store your email, username, profile details, password hash, profile pictures, posts, uploaded photos, comments, likes, follows, blocks, reposts, messages, reports, and support requests. Sessions use random authentication tokens. Hosting systems may record IP addresses and technical request logs.'],
  ['How we use it','We use this information to run your account, deliver content and messages, send verification and recovery emails, prevent abuse, and handle reports and support. This release has no advertising, advertising trackers, or data-sale feature.'],
  ['Who can see it','Signed-in members can see your profile, profile picture, posts, and social interactions subject to blocking and moderation. Post links require sign-in. Recipients can read your messages. Messages are not end-to-end encrypted. Gather operators can access stored data for operation, safety, and support; administrators reviewing a reported message see that message.'],
  ['Service providers','Render hosts the app and stored data; Resend receives your email address and action-email contents to send verification and reset emails. Providers process information under their own service agreements and may operate outside your region.'],
  ['Your controls','You can edit your profile, remove your profile picture, delete your own posts, block accounts, decline message requests, and report content. Choose Contact Us to request account access, correction, or deletion. Account deletion requests are currently handled manually by the operator; this release does not automatically delete an account.'],
  ['Storage and retention','Account data remains while your account is active and until the operator processes a deletion request. Removing a post removes it from the active feed; uploaded files and backups may remain until the operator removes them. Reports may be retained to investigate abuse or meet legal obligations. No automatic retention schedule is implemented yet.'],
  ['Security and children','We hash passwords and action tokens and use HTTPS on the hosted site. No system guarantees perfect security. Gather is not intended for children under 13. If you believe a child under 13 has supplied information, contact the operator through Contact Us for review and removal.'],
  ['Contact and changes','Use Contact Us in Gather for privacy requests. A direct contact email will be displayed when the operator configures one. We will update this notice when the service changes.']
 ],
 Rules: [
  ['Gather community rules','Help make Gather a place where people can connect safely.'],
  ['Respect people','No harassment, bullying, credible threats, hate targeting protected characteristics, or coordinated abuse. Disagreement is welcome; intimidation is not.'],
  ['Protect privacy','Do not publish someone’s private information without permission. No stalking, impersonation, nonconsensual intimate imagery, or sexual exploitation. Never post sexual content involving minors.'],
  ['Keep it honest and lawful','No scams, phishing, malicious links, spam, illegal sales, or instructions intended to harm people. Respect copyright and other people’s work.'],
  ['Messages and requests','Respect declined requests and blocks. Do not create another account to bypass them. Only share content you have permission to share.'],
  ['Reporting and enforcement','Report posts, profiles, or messages from their controls. Reports go to the administrator review queue. Moderators may hide posts and contact members; broader account sanctions are handled by the operator. Do not submit knowingly false reports.'],
  ['Support and immediate danger','Contact Us handles questions, privacy requests, and review requests. Gather is not an emergency service and reports are not continuously monitored. Contact local emergency services if someone faces immediate danger.']
 ]
};
export function Policy({kind}:{kind:'Privacy'|'Rules'}) {
 return <View style={{gap:20}}>{policies[kind].map(([title,body])=><View key={title} style={{gap:8}}><Text style={{fontWeight:'700',fontSize:18,color:'#24143e'}}>{title}</Text><Text selectable style={{fontSize:15,lineHeight:24,color:'#514364'}}>{body}</Text></View>)}</View>;
}
