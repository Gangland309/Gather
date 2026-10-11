# Latest release: Gather v0.9.25

Fullscreen / Exit fullscreen controls for lives, podcasts and Gathering voice parties, with browser fullscreen and an expanded-view fallback. Includes all previous updates. Deploy server and client together using the steps below. Refresh Gather after deployment, join a room and press Fullscreen. Speaker/shared-screen enlargement remains per viewer.

# Latest release: Gather v0.9.24

Gather Assistant plus desktop/mobile top shortcuts for Party with Friends, Podcast, Go Live and Chat Assistant. Includes previous updates. Deploy server and client together using the instructions below. Follow ASSISTANT-SETUP.md to enable AI replies in Render; it needs a server-only OpenAI API key and API billing.

# Latest release: Gather v0.9.23

Gathering voice parties now support screen sharing in supported desktop browsers. See CHANGELOG-v0.9.23.md. Includes all previous updates.

Deploy server and client together using the instructions below, preserving the Render disk, database and environment variables. Refresh Gather and rejoin the voice party to obtain updated permissions. Go to Gathering → Voice party → Start/Join → Share screen, then choose a tab, window or screen. Stop sharing leaves the voice party connected.

# Latest release: Gather v0.9.22

Host desktop recording controls, timer, local download and a shared recording notice. See CHANGELOG-v0.9.22.md. Includes v0.9.21 features. Deploy server and client together using the steps below; keep the existing Render database, persistent disk and environment variables.

To record: open the live as host on desktop, inform speakers, check the recording confirmation, select Record live, choose the Gather tab with Share tab audio, then Stop recording and Download recording. Use Enable sound and headphones to hear guests while recording. Keep the tab open. Save each clip before recording another. Browser/phone compatibility is detected at runtime; phone-native and cloud recording are not included.

# Latest release: Gather v0.9.21

Includes active live users for battle invitations, automatic read status without deleting notifications, desktop Spark autoplay fallback, and admin-only bot controls. See CHANGELOG-v0.9.21.md and MUX-PLAYER-SETUP.md.

Deploy both the server and client using the installation steps below. Keep Render environment variables, persistent disk and the existing database. Do not replace production data with a blank database. After deployment refresh the browser and test with two accounts.

# Gather v0.9.20

Original purple-and-lime colors and logo restored; current features preserved. See CHANGELOG-v0.9.20.md.

# Gather v0.9.19

Your Gatherings and Discover Gatherings are now separate segments. See CHANGELOG-v0.9.19.md. Deploy server and client.

# Gather v0.9.18

Copper and teal in both Light and Dark, with matching logo/default G icons. Includes live thumbnails. See CHANGELOG-v0.9.18.md. Deploy server and client.

# Gather v0.9.17

Black app background removed; the app defaults to Light and resets old theme preferences once. New: recent host-camera thumbnails in active live feed cards. Deploy both server and client. See CHANGELOG-v0.9.17.md.

# Gather v0.9.16

See CHANGELOG-v0.9.16.md for the black/icy-blue palette. Existing light preferences remain available; choose Dark in Appearance to try it.

# New in this ZIP

Moments, shareable lives, and a plain sign-in layout without the supplied picture. See MOMENTS-AND-LIVE-SHARING.md. Opt-in member maps remain included. Includes the previous tagging, Fan Clubs, gifts, wallets and battles updates.

# Gather 0.9.6 — install this update

New: Fan Clubs let creators define member perks with private instructions and HTTPS links, open or application-based membership, and member-only posts. The supplied sign-in artwork has been removed. See FAN-CLUBS-UPDATE.md.

New: @username tagging in posts, captions, comments and Gatherings, with username suggestions, profile links and audience-aware notifications. See USER-TAGGING-UPDATE.md.

New: live gift totals and head-to-head battles with 1×, double and triple points. See LIVE-BATTLES-UPDATE.md for the rules and two-account testing steps.

The admin control panel now includes automatic AI page managers above the manual content bot. See AI-PAGE-MANAGERS-SETUP.md to add your server AI key and enable scheduled public posting. GC distribution has an always-visible amount field and a clear confirmation step. GC Wallet is now in the Me menu and first in Settings.

The admin control panel also includes the Gather content bot. Generate seven drafts, edit/save, then confirm public publication. If needed, press Set up official Gather page first. The manual bot remains available alongside automatic AI text posting. AI-generated pictures and videos are not connected.

This update also includes live gifting. See LIVE-GIFTS-UPDATE.md for testing instructions. Viewers choose the recipient and gift, then confirm the GC or Test GC transfer. Its animation appears over the selected participant’s video or camera-off tile for all viewers. Shop checkout and cash-out remain disabled.

See LIVE-GIFTS-AND-GATHER-PAGE.md. This version creates the official Gather page automatically on API startup, adds creator-to-audience gifts and makes gift announcements extra bold.

See LIVE-GIFT-BUTTON-FIX.md: Gift controls now appear in the phone browser studio, with inline sign-in when needed. Shop gift previews include a working Go to Live button.

See COMMUNITY-PLUS-UPDATE.md for shop photo/video galleries, Gifts previews, public interest hubs, applications, reminders, calls, voice parties, camera effects, navigation and admin additions. Marketing assets and a ten-second Spark video are in the marketing folder.

This cumulative update includes the previous Discord, phone-contact and default G avatar changes, plus:

- Logo-matched purple and lime interface colors with dark mode; original Gather logo preserved.
- Sparks: a dedicated swipe-through video feed, Following filter, likes, comments, sharing and repost controls. Only the active Spark plays, initially muted. Existing audience and block restrictions still apply.
- Podcasts: separate public live conversations with eight speakers total (host plus seven guests). Cameras are optional. Regular live broadcasts remain six speakers total.
- The podcast host can appoint one moderator. Host and moderator can invite users, remove guests, mute their currently published microphone, moderate comments and choose a featured video box shared with viewers. Invitations still require acceptance. Only the host appoints moderators or ends a broadcast. A moderator role does not grant microphone/camera publishing without a guest invitation. Featured layout follows the selected speaker's available camera; audio-only speakers have no video to enlarge. State updates reach other Gather screens within about three seconds.
- My Account: Allow sharing of my content defaults on. Switching it off disables new built-in shares and reposts for existing/future content. It does not undo existing reposts, change audiences, or prevent screenshots or manually copied public links.
- My Account → Privacy · Location: off by default. Select approved Gatherings, then explicitly request device location and share a snapshot for 15 minutes or one hour. Approved members can view/map active shares. Stop sharing everywhere or disable the setting to delete stored shares. Leaving/removal deletes the Gathering share. No background tracking; no location collected on page load. Expired shares are hidden and deleted on subsequent location requests. Web location requires HTTPS. Native location permissions need a new app build.

## Windows / GitHub Desktop / Render

1. Download and extract the ZIP. Open its `gather` folder.
2. Back up your existing project and database first. End active broadcasts before deployment.
3. Copy the contents of the new `gather` folder into your existing Gather repository, replacing matching source files. Keep your existing `.env`, `data`, uploads and Render persistent disk. Do not replace the repository with an empty folder or delete your data.
4. Open GitHub Desktop. Review changes, commit with “Gather Moments, live sharing and sign-in fix”, then Push origin.
5. In Render, use build command `npm ci && npm --prefix mobile ci --include=dev && npm run build:web` and start command `node server/server.mjs`. Keep `DATA_DIR=/var/data` and the existing persistent disk configuration. Wait for the deployment to become Live.
6. Open https://gatherourworld.com and refresh. If the browser still shows old assets, use an InPrivate window. The server adds new database columns/tables automatically.
7. Test with two accounts: content sharing on/off, a public and private Spark, podcast invitation acceptance and moderation, and location sharing into a Gathering both accounts have joined. Deny device location once to verify no share is created; share and then stop to verify it disappears for the other member.

For local use, in the `gather` folder run `npm ci`, `npm --prefix mobile ci`, then `npm run server`. In a second terminal run `npm run web`.

## Services and current limits

Live/podcasts require valid LIVEKIT_URL, LIVEKIT_API_KEY and LIVEKIT_API_SECRET in Render. The Admin live connection check verifies the room API; it does not verify camera, microphone or viewer connectivity. Video uploads and playback require Mux configuration. Podcasts are live sessions, not recorded episodes. Native live media currently opens the secure browser studio; moderator controls remain in the Gather screen. This ZIP contains source and Expo exports, not signed App Store/Play Store installers.

101 automated tests pass, including audience filtering, sharing settings, location consent/membership/expiry/deletion, podcast capacity and moderator permissions. TypeScript and lint are checked. Actual provider streaming, physical device location permissions and eight simultaneous camera streams still require operator/device testing. GC payments/cashout and supplier fulfillment remain unfinished and disabled.

For the upload progress bar and stalled upload diagnostics, see UPLOAD-FIX.md. After Render reports Live, refresh Gather on both devices to load the updated client.

See REQUESTS-AND-CALLS-UPDATE.md for Requests, profile links and call history.

See SETTINGS-AND-SOUND-UPDATE.md for direct calls, the combined inbox and browser sound preferences.

See MARKETPLACE-POSTS-UPDATE.md for Selling, Looking for and Trading posts.

After deploying, set ADMIN_EMAIL to your Gather login email in Render and verify that account to use GC distribution. See ADMIN-GC-AND-GIFTS-UPDATE.md.

See INVITES-AND-SHARING-UPDATE.md for generated links and external sharing.
