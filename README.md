# Gather 0.3 — community update

A working Node 24 + SQLite backend and Expo SDK 57 application for web, iPhone and Android. Registration is open; verified email is required for interactions on the hosted production service.

Implemented in this release:
- Approved purple/lime design and logo on sign-in and in the header.
- Verification emails, resend, password recovery, expiring one-use hashed tokens, and session revocation after a reset.
- Profile pictures: web square crop with zoom and positioning, native picker crop, remove picture, initials fallback, pictures alongside posts/comments/profiles.
- Reposts with original author credit; sharing links through the browser/native share sheet or clipboard. Shared posts require sign-in.
- One-to-one private messages, requests, accept/decline/block, unread counts, and message pagination. Messages refresh every 10 seconds while signed in; no push notifications or end-to-end encryption.
- Profile, post, and message reporting, administrator queues, in-app support requests and administrator replies.
- Privacy and community rules screens, including links before signup and registration acknowledgment.

See INSTALL-WINDOWS.md before updating the live app. No invite-only update is included.

## Local development

From this folder, run `npm --prefix mobile ci`, then `npm test`, `npm run check`, and `npm run lint`.
Run `npm run server` and, in a second terminal, `npm run web`.
Without email configuration local development allows interactions without verification; resend/recovery cannot deliver real emails. Hosted production requires email configuration.
Use `node --env-file=server/.env server/server.mjs` if you have an environment file. Never commit secrets.

## Hosting

Keep the existing persistent Render disk and DATA_DIR unchanged. This release adds database columns and tables in place on startup. Back up your hosted database and matching media files before deployment. The archive contains no user data.
Required production environment: RESEND_API_KEY, EMAIL_FROM, PUBLIC_ORIGIN, NODE_ENV=production, HOST=0.0.0.0, DATA_DIR pointing to the mounted persistent disk. ADMIN_EMAIL identifies the trusted owner; that account must verify its email before moderation access appears.
Production fails startup if email settings are missing. Use your current Render build command (`npm --prefix mobile ci --include=dev && npm run build:web`) and start command (`npm run server`). EXPO_PUBLIC_API_URL should be blank for the same-origin website.

## Product and policy limits

This is a pilot release, not a finished all-in-one platform. No signed App Store/Play Store binaries are included. Policy copy is a draft describing this implementation; the operator should complete contact details, retention practices and legal review before broad launch. Account deletion is a manual support process. Uploaded files and backups require operator cleanup. Rate limits are process-local; proxy-wide request limits still require production tuning. New account age confirmation is self-attestation, not age verification.
