# Gather 0.6.0 — Discord and default G avatars

This is a cumulative update. It includes the previous pilot/live/shop changes, Discord linking, and the isolated Gather G as the default profile picture. Existing members without an uploaded avatar use the G immediately; uploading a picture replaces it, and removing that picture restores the G. The full wordmark is unchanged. No user data is overwritten for this default.

## What works in code

- My account → Discord connection: authorize Discord, return to the original Gather screen, review the Discord username, and explicitly confirm the link.
- One Discord identity per Gather account, and one Gather account per Discord identity. Disconnect before changing accounts.
- Three independent sharing controls, initially off: show Discord identity to mutual Gather friends, share Discord status with those friends, and share Gather status inside Discord.
- Friends → Friends across Gather & Discord refreshes both indicators every 15 seconds. Linked Discord identities also appear on profiles when shared with friends.
- A bot in your configured Discord server receives Discord-provided presence. Users must be members of that server for their Discord status to be available to that bot. Missing presence or a disconnected bot is shown as unavailable rather than falsely online/offline.
- In that Discord server, `/gather friends` replies privately with Gather friends who enabled Gather-status sharing. It shows at most 20 names, with a prompt to open Gather for more. It reads fresh Gather presence, not a stored last-seen history. Anyone else in the channel cannot see the reply.
- Gather Appear offline suppresses both outgoing status displays. Discord invisible/offline is treated as offline. Blocking and suspension stop sharing with the affected viewer. Disconnecting removes the link, pending authorizations, and future status sharing.

This does not overwrite a user's native Discord online dot, custom status, or Rich Presence. It does not import the Discord friend list or expose Discord DMs. Ordinary OAuth identify access does not permit those operations. This release uses mutual Gather friendships and the shared Discord server. OAuth tokens are used only for identity verification and then revocation is attempted; no Discord access/refresh token is retained. If provider revocation fails, Discord's short-lived token can remain valid there, but Gather does not store it.

## Operator setup — step by step

1. Install this ZIP using the steps in PILOT-UPDATE.md: back up data, extract, copy the gather folder's contents into the repository, preserve .env/data, commit, and push. Keep Render's persistent disk.
2. Open https://discord.com/developers/applications and create an application named Gather. Keep ownership under your own Discord account/team.
3. General Information: copy its Application ID. In OAuth2, obtain its Client Secret. These are different from the bot token.
4. OAuth2 → Redirects: add exactly `https://gatherourworld.com/api/discord/callback` and save. If your actual PUBLIC_ORIGIN differs, use that site's origin followed by `/api/discord/callback`; the registered URL must match exactly. PUBLIC_ORIGIN must be HTTPS.
5. Bot: obtain/reset the bot token. Under Privileged Gateway Intents, enable Presence Intent. This integration does not request Server Members or Message Content intents. If Discord requires review for your application's scale, obtain approval before enabling presence in production.
6. In your Discord client, turn on Developer Mode under Advanced. Right-click the Discord server you want connected and Copy Server ID. You must own it or have permission to add the bot. Members are not automatically joined.
7. Install the application in that server with the `bot` and `applications.commands` scopes. No Administrator permission is needed. The Installation/OAuth2 URL generator can generate this link; choose only the intended server. The server and bot must match your settings.
8. In Render → Gather service → Environment, add these **server-only** values:

   ```text
   DISCORD_CLIENT_ID=your Application ID
   DISCORD_CLIENT_SECRET=your OAuth2 Client Secret
   DISCORD_BOT_TOKEN=your Bot Token
   DISCORD_GUILD_ID=your Discord Server ID
   PUBLIC_ORIGIN=https://gatherourworld.com
   DISCORD_SERVER_INVITE=https://discord.gg/your-invite-code
   ```

   The invite is optional and only opens after a user taps it. Do not put secrets in EXPO_PUBLIC variables, GitHub, screenshots, or chat. Use the same Discord application for the client ID, client secret, and bot token.
9. Save and redeploy. Render build remains `npm ci && npm --prefix mobile ci --include=dev && npm run build:web`; start remains `node server/server.mjs`. The bot starts alongside the server when configured and registers its Gather command in the selected server. It requires a continuously running service; a sleeping/restarting service cannot provide reliable live presence.
10. Sign into Gather → My account → Discord connection. It should show linking available and bridge Connected. Connect my Discord → Continue to Discord → authorize → return to the original Gather tab/app → Refresh authorization → review username → confirm.
11. Set the three sharing choices as desired. Repeat with a second real user and accept their Gather friend request. Both users should join the configured Discord server if Discord status is wanted.
12. Open Gather → Friends. Test online, idle, do-not-disturb, invisible, and Gather Appear offline. In Discord type `/gather friends` and verify the reply is private. Also test blocking and disconnection.

The browser authorization screen can safely open on iPhone/Android; confirmation takes place in the original signed-in Gather app/tab, so no Gather session token is passed to Discord or the handoff browser. Requests expire after ten minutes and are bound to the initiating Gather session. If you sign out or change browsers before confirming, restart from the signed-in screen.

## Troubleshooting

- Linking unavailable: check Client ID, Client Secret, and HTTPS PUBLIC_ORIGIN. Existing Gather logins do not depend on Discord.
- Invalid redirect: ensure the portal redirect exactly matches PUBLIC_ORIGIN plus `/api/discord/callback`.
- No confirmation username: return to the original tab/app, tap Refresh authorization, and check the request hasn't expired. Start again after sign-out or denial.
- Discord account already linked: disconnect it from its existing Gather account first. This feature does not bypass another account's ownership.
- Bot login failure: check the bot token, installation, and Presence Intent. Do not use the OAuth client secret as a bot token.
- Unknown status: check bot connectivity, shared-server membership, presence-intent approval, and whether Discord supplied that user's presence. Large servers may not supply every member's initial presence. Unknown is not proof that the person is offline.
- No slash command: install applications.commands scope, use the configured server, and check the bot's command registration message. Check Discord channel/application command restrictions.
- Empty slash reply: caller must have linked Discord, and mutual Gather friends must separately enable Gather-status sharing. Merely being Discord friends is insufficient for this integration.

## Validation and limitations

Server tests exercise authorization state/expiry/replay/session revocation, authenticated confirmation, duplicate identity rejection, sharing/friend/block/offline rules, disconnected-provider status, unlinking, and the public default-avatar asset. TypeScript/lint and web/iOS/Android bundle exports are checked separately. Tests use injected Discord responses/presence; no actual Discord developer application, real bot gateway, phone authorization, or production deployment was tested here. Follow the two-account checklist above before relying on it.

GC payments, completed marketplace trades, connected external shopping stores, supplier fulfillment, SMS phone matching, and native embedded live video are still pending as described in PILOT-UPDATE.md.

## Unexpected token < / HTML instead of JSON

This means one API request received an HTML page rather than JSON. It can affect only one feature while the rest of Gather continues to work. The updated request reader identifies the failing API path and HTTP status and does not display returned HTML. A trailing /api in EXPO_PUBLIC_API_URL is normalized to avoid requesting /api/api routes. This does not repair a wrongly configured deployment or an unavailable backend.

In Render production, leave EXPO_PUBLIC_API_URL unset when web and API share this Node service, or set it to https://gatherourworld.com with no /api suffix. Do not use your browser localhost address as the production API setting. Changes require a new web build and deployment. Open https://gatherourworld.com/api/health: it should return a JSON status, not the Gather home page. In browser Developer Tools → Network, reproduce the error and inspect the failing Fetch/XHR request URL, HTTP status, and response. An HTML response may be a frontend fallback, login/proxy/error page, or wrong endpoint; the exact response is needed to distinguish them. Do not share authorization headers or tokens.

## Permission-based phone contacts

Connect → Find friends now asks for an explicit opt-in before native phone access. The phone then displays its own permission prompt. Available email contacts are shown for individual selection, with none selected automatically. Only the selected emails are submitted for matching after a further Find friends action. Users can send friend requests to matches, skip, remove matches, or open phone Settings to revoke OS access. No automatic friend creation or invitation messages. Android contact write permission is blocked; this feature only reads. Changing native permission text/config requires a new signed native build. The web version accepts manually selected emails; it does not access the phone address book. Phone-number-only matching remains pending verified phone ownership/SMS setup.
