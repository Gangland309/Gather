# Latest validation: Gather v0.9.28

137 automated tests, TypeScript checks, Expo lint and web/iOS/Android bundle exports passed. Mobile header uses a fixed 56-point single row and 44-point Back/Post/Menu targets, with search and actions hidden inside expandable menu sections.

No production deployment or physical-device QA performed. Browser visual QA could not run because no browser executable is installed. Check the mobile menu, keyboard/search results, navigation and landscape orientation after deployment.

# Latest validation: Gather v0.9.27

137 automated tests passed, including changing assistant setup, server authorization, offscreen/late playback and single/double tap arbitration. TypeScript and Expo lint passed. Web, iOS and Android bundle exports passed.

No production deployment, live OpenAI requests, browser interaction QA or real-phone testing performed. Native scroll visibility is checked every 250 ms; fullscreen preserves playback. Test fullscreen, double-tap likes and scrolling on your devices after deployment.

# Latest validation: Gather v0.9.25

133 automated tests passed. TypeScript and Expo lint passed. New fullscreen helper tests cover native entry/exit, fullscreenchange handling, denied/unsupported native fallback, Escape behavior, focus restoration and listener cleanup.

Real-browser fullscreen, dialog layout, screen-share rendering and physical-phone behavior have not been visually tested. No deployment was performed. Web, iOS and Android bundle exports passed.

# Latest validation: Gather v0.9.24

130 automated tests passed. New tests cover disabled setup, sign-in/verification, bounded histories, rejected system messages, safe provider failures, persistent usage budgets, Responses request structure, model selection and response parsing with provider fixtures.

Real OpenAI requests were not made. No API key was supplied for a live-provider check. UI/browser/phone QA and production deployment have not been performed. Final TypeScript and Expo lint checks passed. Web, iOS and Android bundle exports passed.

# Latest validation: Gather v0.9.23

126 automated tests passed. Voice-party authorization tests now verify microphone, screen_share and screen_share_audio grants, camera exclusion and approved-member access checks. Final TypeScript and Expo lint checks passed. Web, iOS and Android bundle exports passed.

Screen capture, browser permission cancellation, remote screen rendering and shared audio have not been tested between real browsers. No deployment or real-phone QA was performed.

# Latest validation: Gather v0.9.22

126 automated tests passed; TypeScript, Expo lint, and web/iOS/Android bundle exports passed. The new recording test verifies host token authorization, shared notice visibility, input validation, expiry, stopping and preservation of the active live.

Real-browser recording, microphone/tab audio mixing and download playback have not been tested. No production deployment or real-device QA was performed.

# Latest validation: Gather v0.9.21

125 automated tests passed. TypeScript check and Expo lint passed. Web, iOS and Android bundle exports passed.

New tests cover notification batch ownership, preserved history, new unread notifications, active battle-user visibility, admin restrictions, asynchronous Spark startup and blocked autoplay fallback.

No production deployment, signed native installer, real-phone test, live Mux-provider playback test or visual/browser QA was performed. Desktop startup improvements are tested with simulated media readiness; production video issues may also involve provider or network configuration. Mux Player integration instructions are included; the player replacement is not implemented in this release.

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

## Gather v0.9.17
119 tests passed, including live thumbnail host control authorization, upload throttling, JPEG envelope validation, expiry, deletion and broadcast visibility. TypeScript and lint pass. All platform bundle exports are checked before packaging. Updated light palette and one-time theme preference reset remove the black app background. Real-camera snapshots, visual layout and phone testing remain pending; no deployment is claimed.

## Gather v0.9.19
120 tests passed. New API coverage checks owner membership, discover/joined separation, pending approval, accepted membership and leaving. TypeScript and lint passed; all platform bundle exports are verified before packaging. No production deployment or real phone/layout verification is claimed.


## Gather v0.9.20
Color and branding restoration only. TypeScript, lint and all platform bundle exports are checked before packaging. Existing 120-test result from v0.9.19 covers unchanged backend functionality. No real-phone, visual-layout or production-deployment verification is claimed.
