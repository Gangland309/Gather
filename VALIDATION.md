# Validation for Gather 0.5.0

48 backend tests pass, including invite reuse/expiry/rollback, audited suspension and revoked sessions, onboarding, caption ownership/privacy, idempotent starter Gatherings, post rate limiting, product photo visibility/ownership, signed Mux caption/trim requests, and LiveKit diagnostics/cleanup. Existing auth, messages, private audiences, blocks, gallery, shop catalog, content bot, and persistence tests remain included.

TypeScript and Expo lint pass. Web, iOS, and Android exports pass. These are source/bundle checks, not signed application builds or real-device QA.

LiveKit and Mux tests use injected transports. There has been no real-provider, browser media, audio echo, WebRTC network, phone contact, payment, or fulfillment verification. The device checklist in PILOT-UPDATE.md is required to assess real-world behavior. No production deployment was performed.
