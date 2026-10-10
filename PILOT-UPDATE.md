## Shop sections

Buyers shows member resale, merch, and product listings; Sellers manages your profile and listings; Trading shows member trade listings with offered/requested items described by the seller; Shopping shows dropship and third-party listings. Trading listings use no GC price and cannot enter the shopping bag. Trade offers/acceptance, payment, escrow, shipping, and connected external stores are still pending.

## Latest live changes

Distinct 48-pixel setup/action buttons, public-live confirmation, grouped camera/flip/mic/end controls below video, six broadcasters (host plus five invited guests), and scrolling comments visible to everyone. Native builds open live video in the browser; they do not embed a native live video room. Host browser handoff can end its broadcast with a scoped, expiring control token. Camera flipping depends on available cameras and browser support.

# Gather pilot update

This is a cumulative source update. It does not deploy itself or contain signed phone installers.

## New behavior

- Inter Regular, Medium, Semibold, Bold, and ExtraBold are installed and bundled. Text and inputs choose the matching face.
- Home emphasizes the feed. Secondary features remain in the feature strip/Menu; repetitive swipe instructions were removed. Browser sessions survive refresh in the same tab using sessionStorage. Sign-out clears the local session even if the server is unreachable; an unreachable server cannot revoke its token immediately.
- New/existing members who have not finished onboarding see an interest checklist and links to profile, people, and Gatherings. Interests persist; they do not yet rank the chronological feed.
- Admins can create single-use, seven-day invitation codes and three starter Gatherings with genuine admin-authored pinned conversation prompts. Starter creation is explicit and repeat-safe. No fake members or engagement.
- Set INVITE_ONLY=true on Render to require a code at registration. Existing users can still sign in. Codes are stored hashed and consumed in the same database transaction as account creation. Create codes using your existing verified admin account before inviting people.
- Moderation includes account search, suspension/restoration with a reason, session revocation, and account-action history. Admins cannot suspend themselves, other admins, or the official page. Suspension stops Gather account access; it does not automatically erase old content or disconnect already-connected external live participants. Use live host controls and post moderation for those.
- New posts are limited to 30 per 10 minutes per member, comments to 30 per 10 minutes, and support/report actions to 10 per hour. These in-memory counters reset on server restart and are not distributed across multiple instances.
- Photo tools rotate, horizontally flip, and center-crop a square before publishing. Native picker cropping remains available. Edit written captions on your own posts; audience and media stay unchanged.
- Optional English spoken captions can be requested with a new Mux upload. Mux finishes them after video processing. Players expose caption controls when tracks become available. This is not live captioning or translation; old uploads are not automatically backfilled.
- Uploaded, processed videos can be trimmed into a new signed Mux asset by start/end seconds, then checked for readiness before posting. Original remains intact. Minimum clip duration: 0.5 seconds. Uploads and clips share a ten-per-day allowance. Additional provider storage/encoding usage may apply. This is trimming, not a full timeline editor with music, filters, or text overlays.
- Web video supports HLS.js where native HLS is unavailable, plus playback retry and subtitle selection. Live distinguishes reconnecting/disconnected states, mutes local previews to avoid echo, supports browser audio activation, tolerates departed participants during broadcast ending, and normalizes trailing slashes in LiveKit URLs.
- Shop supports product photos with ownership checks. Draft photos remain private to the seller; pending photos are visible to admins; approved listing photos are public. Archiving removes that access unless another public use exists.
- Content bot can spotlight an actual public Gathering in addition to its template drafts. It remains an admin-reviewed template bot, not an autonomous AI publisher.

## Install

1. Back up your existing database and uploads before deploying the additive schema migrations.
2. Extract this ZIP and copy the contents of its gather folder into your existing repository. Keep your .env, persistent data, and Render disk.
3. Commit and push with GitHub Desktop.
4. Render build: npm ci && npm --prefix mobile ci --include=dev && npm run build:web
5. Render start: node server/server.mjs
6. Keep DATA_DIR=/var/data, NODE_ENV=production, PUBLIC_ORIGIN=https://gatherourworld.com, your verified ADMIN_EMAIL, Resend settings, and origin settings.
7. Add INVITE_ONLY=true. Your existing admin can create invitations under Menu → Moderation → Pilot access and accounts. Do not enable it before you have a working admin login.
8. Check service settings in the same panel. Missing LiveKit/Mux names are shown, never secrets. Present settings do not prove a successful provider connection.
9. Wait for Render Live and refresh. Rebuild native signed apps for new Expo font/image-manipulator dependencies. Native IDs and signing still need production values.

## External work still required

- LiveKit Cloud URL/key/secret and a two-device test. Native live remains a browser handoff.
- Mux API credentials and signing key; real-device uploads, trimming, subtitle generation, and playback tests. Auto captions can be inaccurate; creators should review speech before relying on them.
- Stripe/other approved payment-provider setup, creator onboarding, receipt validation, immutable wallet ledger, refunds/chargebacks, tax/payout handling, and store billing. No real GC balance, purchase, gift, withdrawal, or shop checkout is implemented. The accepted gift fee is 10% of proceeds after payment/store fees; the GC purchase/redemption rates and withdrawal minimum are not finalized.
- Supplier account/agreements and authenticated integration (start with Printful for merch, or Shopify Collective/Syncee through a supported commerce store). No automated inventory, orders, shipping, return fulfillment, or products imported from stores yet. Catalog fields and bag do not mean something is purchasable.
- Permission-based phone contact matching needs verified phone ownership and an SMS provider. Current contact matching uses selected email addresses only. Do not claim phone syncing is available.
- Product variants, fees/taxes/shipping quotes, refunds, native store submissions, and final operator/privacy policy details remain launch work.

## Device pilot checklist

Use two real accounts and test iPhone Safari, Android Chrome, desktop browsers, and native development builds separately. Record device, OS, app/build version, action, expected result, actual result, and an error screenshot where needed.

1. Admin login, create invite, successful signup, reject reuse/expired code, verify email, forgot password, sign out, sign in, refresh session.
2. Save interests, edit bio/avatar, follow/request/accept, suggestions, notifications, privacy and blocking from both accounts.
3. Publish text, picked/captured photo, crop/rotate/flip, microphone denial, each audience, caption edit, comments/likes/reposts, private gallery. Confirm unauthorized accounts and visitors cannot see private material.
4. Swipe/tap all five features; Menu folders; bottom shortcuts; light/dark/system appearance; narrow screens; keyboard; large accessibility text.
5. Mux upload with English captions, wait for processing, play on each browser, select captions, trim, post clip, invalid limits, upload failure, expired playback retry. Check voice accuracy and whether billing is acceptable.
6. Start LiveKit broadcast, allow camera/mic, use second device as viewer, unblock sound, invite/accept five guests (six broadcasters including host), reject a seventh broadcaster, flip camera, mute microphone, check scrolling comments from host/guest/viewer screens, mute/remove, ban, hide chat, deny permission, interrupt network, rejoin, end, restart.
7. Report content, hide it, suspend test user, verify old sessions stop working, restore and sign in; review audit. Create starter groups twice and confirm there are only three.
8. Save seller policies, photo and draft listing, unauthorized edits, admin approve/reject, bag stock limits, archive. Confirm no checkout or money is presented as completed.
9. Recruit a small invite-only cohort. Observe whether people finish onboarding, find a Gathering, make their first post, and return. Fix observed friction before broad signup or real payments.

Automated checks cover server behavior, types/lint, and exported bundles. They do not replace this device/provider pilot. No live-site deployment or real-phone verification was performed here.

## When both accounts are stuck joining live

After deploying this update, admin: Menu → Moderation → Test LiveKit server connection. This checks whether Gather can authenticate to LiveKit’s room API. If it fails, confirm the URL, key, and secret come from the same LiveKit project, save Render settings, and redeploy. If it succeeds, leave the broadcast screen and rejoin to obtain a fresh token. Try a second network without a VPN or restrictive firewall. Use separate Gather accounts for host and viewer. Join errors now appear explicitly with a 35-second initial connection limit. Host enables camera and microphone only after connecting; viewers do not need those permissions to watch. Report the exact error shown if joining still fails. This check does not prove browser WebRTC connectivity or test your device remotely.
