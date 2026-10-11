# Validation for Gather 0.8.1

65 automated tests pass, including invite reuse/expiry/rollback, audited suspension and revoked sessions, onboarding, caption ownership/privacy, idempotent starter Gatherings, post rate limiting, product photo visibility/ownership, signed Mux caption/trim requests, and LiveKit diagnostics/cleanup. Existing auth, messages, private audiences, blocks, gallery, shop catalog, content bot, and persistence tests remain included.

TypeScript and Expo lint pass. Web, iOS, and Android exports pass. These are source/bundle checks, not signed application builds or real-device QA.

LiveKit and Mux tests use injected transports. There has been no real-provider, browser media, audio echo, WebRTC network, phone contact, payment, or fulfillment verification. The device checklist in PILOT-UPDATE.md is required to assess real-world behavior. No production deployment was performed.

Discord checks use injected OAuth/presence responses. They cover state expiry/replay/session binding, authenticated confirmation, unique identity linking, opt-in status/friend/block/offline rules, provider-unavailable state, disconnect, and the shared default G asset. No live Discord bot or real-phone OAuth test was performed.

The client response reader is tested against HTML responses, invalid JSON, JSON API errors, and a trailing /api configuration. This is defensive handling; the production HTML response has not been diagnosed or reproduced.

New tests cover ready-video Sparks filtering and self audiences, share opt-out enforcement, location default/consent/member access/expiry/deletion, eight-person podcast capacity, moderator invitation/muting/removal/director permissions and host-only ending. Physical devices and configured external providers have not been tested in this session.

Community Plus checks cover shop gallery/video ownership and review access, idempotent public interest hubs, application approval/private group pictures, deduplicated reminders, disabled gift charging, call acceptance and friend restrictions, audio-only voice-room grants, browser camera pixel effects, and official-page photo/video marketing posts. Marketing video is H.264, 720×1280, ten seconds. Voice/call provider connectivity, local notification behavior, green-screen recording and native device UI remain unverified on real devices.

0.8.1 posting update: TypeScript and lint passed; web, Android and iOS exports completed; 65 existing automated tests passed. Posting camera flip and upload recovery require real-device/provider validation.

0.8.2: 66 automated tests passed, including validated-origin Mux upload coverage. TypeScript and lint passed. Upload progress measures transfer bytes; processing percentage is not reported by the provider. Real device/Mux verification pending.

0.8.3: 68 automated tests passed, including recipient-only live invitation denial and call history privacy/status transitions. TypeScript, lint and web/iOS/Android exports passed. Real phone/provider verification remains pending.

0.8.4: 69 automated tests passed, including call privacy policy, notification settings, saved timeout, direct token access and peer identity. TypeScript, lint and web/iOS/Android exports passed. Sound controls use browser capture constraints and LiveKit device/volume APIs; physical device/provider audio validation remains pending.

0.8.7: 73 automated tests passed. Coverage includes personal marketplace posts, private GC wallets, verified owner issuance, large exact balances, Test GC separation, idempotent grants, gift catalog and generated invitation validity/consumption/revocation/quota. TypeScript, lint and web/iOS/Android exports passed. Actual device share-sheet/clipboard and production provider verification remain pending.

## 0.8.8 Live gifts

74 tests passed. TypeScript and lint passed. Added atomic sender/recipient journal entries, idempotent live gifts, public event cursor polling and recipient tile animations. LiveKit/browser/phone playback still requires operator testing.

## 0.8.9 Admin content bot

TypeScript and lint passed. Existing content-bot authorization and publication endpoints are unchanged; the last backend test run passed all 74 tests. Added the bot to the admin panel, explicit official-page setup, shared-draft refresh and a synchronous submission lock. Actual deployed admin UI still requires operator checking.

## 0.9.0 Automatic AI managers, GC form and wallet navigation

80 tests passed; TypeScript and lint passed. AI worker tests cover persisted schedules, overlapping worker claims, role rotation, pause during generation, failed/flagged content, interrupted jobs, owner permissions, explicit automatic-publishing configuration, rolling caps, draft-only runs, raw Responses parsing and moderation. Provider calls use controlled fake responses; no real API credentials were used. Existing GC tests continue to verify exact amounts, owner-only issuance and retry idempotency. GC form always renders amount and review controls; wallet has a Me menu destination and is first in Settings. Actual deployed UI and live provider generation remain to be tested by the operator.

## 0.9.1 Live gift button

80 tests passed. TypeScript and lint passed. Gift controls now render inside both live transports and the phone browser studio, with an inline Gather login for an unsigned-in browser. A single eligible recipient is preselected. Shop Gifts routes to Live. Account credentials are not added to handoff URLs. Deployed phone/video behavior still needs operator testing. The previously reported Render 502 is not diagnosed or claimed fixed by this UI update.

## 0.9.2 Official page and audience gifts

82 tests passed, including startup page/wallet creation, idempotent page identity, preserved unfollows, creator-to-viewer gifting, audience role privacy, offline/expired/left viewer exclusions and Test GC isolation. TypeScript and lint passed. Gift announcement typography is larger and extra bold. The production browser was not signed into admin; no production page mutation occurred. The reported 502 is still unverified from Render logs.

## Gather 0.9.3 · Live totals and battles

87 automated tests pass. Added checks cover live gift totals, one-time historical receipt backfill with large integers, double/triple scoring, acceptance/denial/expiry, duplicate gift retries, concurrent challenges, separate GC/Test GC wallets and scores, competitor gifts excluded from scoring, exact timer start/deadline boundaries, frozen results after restart, ties/winners, removal/cancellation/end and ineligible competitors. Existing 82 checks remain included.

TypeScript and Expo lint pass. Web, iOS and Android exports pass. Battle and gift totals are server-authoritative and persisted; the public scoreboard is refreshed by polling.

The attempted local browser layout check could not run because the Playwright browser binary is unavailable. No screenshot, real phone layout, live provider connectivity or production deployment verification is claimed. Camera, audio, sign-in, gift animations and multi-viewer scoring must be checked with actual configured devices after deployment. The earlier /admin/official HTTP 502 remains undiagnosed without Render runtime logs.

## Gather 0.9.4 · User tagging

91 automated tests pass. New checks cover case-insensitive tag parsing, source offsets, email/URL/overlong-handle exclusions, duplicate/self notifications, caption edit deduplication, comment mentions, public profile-link metadata, block/suspension exclusions, suggestion privacy, ten-tag limits and failed-write rollback, Only-me/friends/private-follower/private-Gathering restrictions, membership removal and Social notification preferences. All previous live battle and gift tests remain included.

TypeScript, Expo lint and web/iOS/Android exports are checked for this release. Live device UI and provider connectivity are not verified. No production deployment is performed here; use the included two-account checklist after deploying.

## Gather 0.9.4 · Fan Clubs and supplied artwork

94 automated tests pass. Fan-club checks cover summary-only previews via both club and Gathering APIs, approved-member perk details/links and post visibility, free membership, join/leave, application approval, owner-only perk/membership changes, moderator restrictions, notifications and unchanged-save deduplication, ban/removal, block/suspension exclusions, HTTPS/credential link validation, perk-count limits and rejected-write preservation. Existing tagging, battle, wallet and AI checks remain included.

The uploaded PNG is copied unchanged into the application assets. TypeScript and Expo lint pass; final web/iOS/Android exports are regenerated for this complete release. Native signed installers, physical-device layouts, real-provider connectivity and production deployment are not verified.

## 0.9.5 — member maps and sign-in background
- 97 automated tests passed, including projection/polar clamping, date-line wrapping, dragging, visible tile bounds and the existing location consent/membership/expiry/deletion test.
- TypeScript and Expo lint passed.
- Web, iOS and Android bundle exports are checked before packaging. They are not signed store installers.
- No real device, live tile-provider session, deployment or visual browser QA is claimed. Follow MAP-UPDATE.md device checks before rollout.
