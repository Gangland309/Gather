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
