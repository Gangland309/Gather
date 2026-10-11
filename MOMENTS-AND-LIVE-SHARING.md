# Gather 0.9.6

## Changes

- Sign-in and registration use a plain, scrollable form with the existing Gather logo. The supplied artwork and full-screen overlay are removed.
- Home → Moments adds text, photo and video updates. Each expires after 24 hours. Video clips must be 60 seconds or less and use the existing Mux service.
- Choose Friends (mutual followers) or explicitly confirm Public. Private-account follower restrictions, suspensions and blocks still apply. Moments require sign-in to view.
- The viewer has Previous, Next and Close buttons. Creators see unique view counts and can delete their own Moments. An unseen Moment has an accent ring.
- Live and podcast listings and selected broadcasts include Share live. The browser studio includes sharing for public broadcasts. Share opens the device share menu where available; otherwise copy the link.
- Links use `?page=Live&liveId=...` or `?page=Podcasts&liveId=...` and open the requested broadcast. Ended broadcasts show the server's unavailable message. Invitations, moderation and bans continue to apply. Private call-room access tokens are never included in sharing links.
- Member maps, tagging, Fan Clubs, gifts, battles, wallets and AI managers remain included.

## Install

Use INSTALL-THIS-UPDATE.md. Replace source files, preserve your .env and persistent data, commit and push in GitHub Desktop, then wait for Render deployment. No production deployment was performed while preparing this ZIP.

## Check after deployment

1. Open sign-in on a phone and desktop. Confirm the logo, fields and buttons are visible without the artwork.
2. Sign in; create a text Moment, then a photo Moment. Open them on a second account. Try Friends and Public separately.
3. Delete a Moment; confirm it disappears after refresh on the second account. Expiry is enforced on server requests and the viewer closes at its expiry time. Stored records/files are not promised to be permanently erased at 24 hours; existing owner upload access remains.
4. Start a live; share its link into another browser. Confirm it opens that live, then end the broadcast and try the link again.
5. Test a short video upload with Mux configured; wait for processing before publishing it as a Moment.

## Verification

101 automated tests passed, including new Moments consent, audience, blocking, expiry, photo access, video access, ownership and unique-view checks. TypeScript and lint passed. Web, iOS and Android exports passed. Live provider streaming, real phone rendering, native share menus and production video uploads require post-deployment testing.

## Video troubleshooting — one step at a time

Start with a short local video in Gather and press Upload selected video. Record the stage and exact error.

- “Video uploads are not configured”: open Render → Gather service → Environment. Check that MUX_TOKEN_ID, MUX_TOKEN_SECRET, MUX_SIGNING_KEY_ID and MUX_SIGNING_PRIVATE_KEY exist and contain your Mux values. Do not send their values in chat. Save changes and redeploy. An enabled config response only checks presence, not credential validity.
- “Video service is unavailable”: check Mux API credentials and account/service availability.
- “Could not connect” or a stalled transfer: check internet access and that the browser's site address is allowed. Uploads use the validated browser Origin for Mux CORS.
- 100% with processing unfinished: press Check video processing. Upload and processing are separate stages.
- File-size/duration error: regular posts support up to 100 MB and five minutes; Moments supports 60 seconds or less.

The current production upload cause has not been established. This release adds Moments; it does not claim to repair unverified Mux credentials or production infrastructure.
