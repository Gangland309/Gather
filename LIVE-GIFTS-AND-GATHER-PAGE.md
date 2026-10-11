# Gather 0.9.2 — Official page, live gifts and bold gift announcements

## Official Gather page

Deploy this update using INSTALL-THIS-UPDATE.md. On API startup, Gather creates its official public page if none exists. The display name is Gather, it uses the default branded G avatar and has the bio “Find your people. Share your world. Official Gather announcements, interest spotlights and community conversations.” It has its own GC wallet. It is separate from the admin's personal account and cannot be signed into using a known password.

Existing active users follow it when it is created; new registrations follow it too. Existing page identity, posts, bio and intentional unfollows are preserved on subsequent startups. Repeated setup does not create duplicates or refill balances. It uses username gather when free, otherwise a unique official username. Open the Gather menu section to view it. No fabricated member posts are seeded.

The page exists before the AI scheduler starts. Add OPENAI_API_KEY in Render and follow AI-PAGE-MANAGERS-SETUP.md to configure and activate the managers. Automatic page creation does not automatically enable billable AI generation. The admin panel can also generate one AI draft for review.

The live site was reachable in the development browser but that browser had no signed-in admin session. Its health endpoint could not be inspected from this browser. This ZIP creates the production page only after you deploy it; no production page creation is claimed before deployment. The earlier HTTP 502 still needs Render logs if it continues.

## Live Gift button

Gift controls are now beside the live controls on the regular Gather screen and in the phone browser studio. If the browser is not signed in, **Gift · sign in to send** opens an inline email/password sign-in without leaving the broadcast. The native Gather screen retains gifting controls beside its browser-launch button. Shop → Gifts has **Go to Live · send a gift**.

Join Live or Podcasts, press Gift, select a recipient, choose a gift and GC or Test GC, then press Send gift. Select the funded wallet: GC and Test GC do not mix. Every sender must be verified and funded. You cannot gift yourself. Gift announcements use 18-pixel extra-bold Inter text with a stronger shadow to stand out over video.

## Creators can gift the audience

Hosts and accepted guests can select Speakers or Audience recipients. Viewers can still gift speakers, but cannot send viewer-to-viewer gifts. Search usernames in the recipient picker. One eligible recipient is preselected automatically.

Audience recipients must be signed-in, verified and currently watching in a Gather screen or browser studio. That signed-in screen sends a heartbeat every ten seconds; eligibility expires after thirty seconds without a heartbeat. Anonymous viewers cannot receive GC. Appear-offline, suspended, banned, blocked or expired viewers are excluded. Leaving the screen clears its audience presence when possible; otherwise the short expiry handles it. Audience presence is not a publicly browsable member directory: only speakers can fetch gift recipients. Background/browser throttling may temporarily expire audience eligibility; return to the foreground to renew it.

Speaker gifts animate over the chosen camera tile or camera-off placeholder. Audience gifts create a temporary named celebration tile for all viewers, then remove it. Audience recipients are not represented as broadcasting a camera. Public gift announcements display sender, recipient and gift name. Transfers debit one wallet and credit the selected recipient's wallet, with signed receipts and retry protection. Test GC remains Test GC. Cash-out and shop checkout remain disabled.

## Check after deployment

1. Refresh both browsers; reopen a phone browser studio from Gather to load new assets.
2. Verify the Gather page exists before pressing AI manager Start. Generate one AI draft after adding the API key.
3. Fund test accounts using the visible Admin GC distribution form; verify Me → GC Wallet balances.
4. Watch with a signed-in viewer and host/guest. Gift the host from the viewer, then gift the viewer from the host. Check the correct animation target and both balances.
5. Verify the extra-bold announcements. Toggle the viewer to appear offline and confirm that it disappears from audience recipients. Leave the viewer screen and confirm eligibility expires.
6. If API requests return HTML/HTTP 502, inspect Render runtime logs. This UI update cannot repair an unreachable server by itself.

82 automated tests passed, including one-time gift transfers, Test GC separation, creator-to-audience permissions, offline/expired viewer exclusions, automatic official-page setup and AI scheduler controls. TypeScript and lint passed. Real phone/LiveKit and OpenAI API behavior still need deployment testing.
