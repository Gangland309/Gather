# Gather current update — 0.4

This package contains the current working source and exported web, iOS, and Android JavaScript/assets. It is not an App Store/Play Store installer, signed APK, or IPA. Keep your existing database and media disk when updating.

## Included

- Your uploaded purple/lime connected wordmark on sign-in and the app header.
- Post audience: Only me, Friends (mutual follows), Public, or a Gathering. Private accounts must explicitly confirm public posts. The photo/video access checks follow the post audience.
- Public/private accounts; private accounts approve new follow requests. Existing accounts become private on migration; existing followers remain approved. New users can choose privacy at signup or in My account.
- My account: privacy, verified-email contact discoverability, HTTPS social/bio links, notification preferences, password changes that revoke other sessions. Sign out remains in the app header.
- A private gallery of uploaded photos. Removing a gallery entry does not remove photos already in posts or immediately delete their stored files.
- Gatherings: create, browse/search, My Gatherings, public joins/private approval, text posts, photos/videos through the Home composer’s Gathering audience, likes/comments/reports, owner/moderator approval/removal/bans, moderator promotion, pin/hide posts, invitation links. Group invitation links require sign-in; public individual posts can be viewed anonymously.
- Official Gather page: an administrator creates a dedicated page from the Gather screen and posts announcements. Existing/new accounts follow it initially and may unfollow. It does not replace the admin’s personal account.
- In-app activity notifications for social activity, requests, messages, support replies, Gathering activity, and live starts/invitations, plus an activity badge and category preferences. Native push and notification email are not included.
- Invite friends using device share/copy link, plus HTTPS links to other social profiles. This does not sign into those platforms, scrape friends, or send messages automatically.
- Opt-in email contact matching against verified, opted-in members. Native contacts require permission and review; web users can paste selected emails. Raw contact names/emails are not retained in the contact-match table. Disconnect deletes stored matches. Phone-number matching is not included.
- Camera photos and microphone-enabled video recording: native system capture and web camera/MediaRecorder. Web capture requires HTTPS or localhost. Users can close the camera, stop recording, or deny permission.

## Video and live: implemented, setup required

Video uses Mux direct uploads, progress, provider status checks, signed playback, and thumbnails. Client limit: 100 MB/five minutes; backend checks the processed duration before publication. A direct-upload URL can receive bytes outside the app, so this is not a provider-level hard byte quota. Ten video requests per member/day limit abuse. Provider storage/bandwidth charges depend on your plan. Configure Mux before enabling uploads. Real-provider upload/playback has not been tested here.

Live uses LiveKit Cloud: anonymous viewers subscribe only; verified host plus one approved guest may publish camera/microphone. Controls include invitation/acceptance, local camera/microphone toggles, host guest mute/removal, chat moderation/ban, and ending. Cloud token revocation is used when removing a guest. This version deliberately requires LiveKit Cloud for revocation; arbitrary self-hosted URLs are not enabled. Set a spending/concurrency limit with the provider before opening public viewing. Real-provider calls and physical-device live sessions have not been tested here.

**On iPhone/Android, live media opens in the phone browser in this release. Embedded native live media is not included.** Native app controls remain available to manage the broadcast. A short-lived LiveKit connection token is passed in the URL fragment and removed from browser history on load; no Gather account token is passed. On the web, live media is embedded. Gather does not record live broadcasts.

## Update your existing Render app

1. Back up the persistent database and media before deploying an additive migration.
2. Extract this zip. Copy the contents of its `gather` folder into your existing GitHub Desktop repository. Include new files, both package-lock files, and the mobile assets. Do not replace your `.env`, `server/data`, or Render disk contents. Do not copy `node_modules`.
3. In Render, set the build command to:

   `npm ci && npm --prefix mobile ci --include=dev && npm run build:web`

4. Keep start command `node server/server.mjs`, `HOST=0.0.0.0`, `NODE_ENV=production`, `DATA_DIR=/var/data`, existing Resend settings, and `PUBLIC_ORIGIN=https://gatherourworld.com`. Ensure `ADMIN_EMAIL` equals your verified Gather login email to manage the official page.
5. Commit and push through GitHub Desktop. Wait for Render to show Live, then refresh the site. Do not overwrite or recreate the persistent disk.
6. Test with two accounts: private follows/approval, Only me/Friends/Public posts, gallery isolation, private Gathering approval, comments, notifications, and contact consent. Friends need to follow each other.
7. The Gather screen lets your administrator create the official page. Existing accounts are followed once at creation; later unfollows are respected.

## Configure providers in Render (do not paste secrets into chat/GitHub)

Mux environment values:

- `MUX_TOKEN_ID`
- `MUX_TOKEN_SECRET`
- `MUX_SIGNING_KEY_ID`
- `MUX_SIGNING_PRIVATE_KEY` — base64 PEM signing private key from Mux, or PEM text.

LiveKit Cloud environment values:

- `LIVEKIT_URL` — `wss://YOUR-PROJECT.livekit.cloud` (no trailing slash)
- `LIVEKIT_API_KEY`
- `LIVEKIT_API_SECRET`

Keep these values server-only. Do not prefix them with `EXPO_PUBLIC_`. Choose provider plans and budgets yourself; nothing is purchased or provisioned by this package. Enable/test one provider at a time. Without credentials, upload/live creation returns a setup message instead of pretending to work.

For native testing, set `EXPO_PUBLIC_API_URL=https://gatherourworld.com` and `EXPO_PUBLIC_SITE_URL=https://gatherourworld.com` in your local mobile environment; run `npm --prefix mobile ci` then `npm run mobile`. New native camera/contact permissions require a new development/production build where applicable. Native app identifiers are still example placeholders; change/sign them before store submission.

## Validation

34 Node API tests pass, including audience/media privacy, private Gathering authorization, contact consent/opt-in, official-page behavior, and mocked video/live providers. TypeScript and Expo lint pass. Web/iOS/Android bundle exports are generated after these checks. Actual email delivery, browser camera recording, device capture/contact permission, Mux playback, LiveKit Cloud streaming/revocation, and store installation remain device/provider acceptance tests; bundles and mocks do not prove those flows.
