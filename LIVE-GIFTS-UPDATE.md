# Gather 0.8.8 — Live gifts

In Live or Podcasts, join a broadcast and press **Gift a live participant**. Choose the host or an accepted guest, pick a collection and gift, choose GC or Test GC, and confirm **Send gift**. You cannot gift yourself. The selected wallet is debited immediately and the same amount is credited to the recipient. No platform fee is taken in this version. These are internal credits; creator cash-out, credit purchases and shop checkout remain disabled.

Every gift uses its server catalog price. Sending and receiving each creates a signed wallet entry. Insufficient funds, removed guests, blocked users, banned viewers and inactive broadcasts cannot receive new transactions. Retries use a retained request key, so a repeated request charges once. If confirmation fails, retry that gift before starting another. Choosing a new gift leaves any already-completed transfer in place; inspect My GC wallet when uncertain.

Gift animations appear in the recipient's video box, including a camera-off placeholder. Rise, spin and pulse effects use the catalog's original symbols. Reduced-motion browsers use a fade. All viewers poll the live gift feed roughly every 1.5 seconds; timing varies by network and browser background throttling. Joining starts at the current cursor, avoiding replay of previous gifts. Recent events only are animated. Gifts do not enable cameras or microphones and do not change the featured speaker.

## Deploy and test

1. Follow INSTALL-THIS-UPDATE.md to replace source files, commit/push and redeploy Render. Keep the existing persistent disk, database, environment variables and LiveKit settings.
2. To issue test credits, set ADMIN_EMAIL in Render to your Gather login email, redeploy, verify your email and sign out/in. In Moderation → Admin GC distribution, issue **Test GC** with the testing purpose to your viewer account.
3. Host a live from account A. Invite account B and have B accept. Open a third signed-in account C as a viewer and an additional browser as another viewer.
4. From C, choose B and send Spark using Test GC. Both viewing screens should animate B's tile, not A's tile. Check C's wallet decreases by 5 Test GC and B's increases by 5 Test GC; GC balances stay unchanged.
5. Send a gift to A, repeat with its camera off, and check the placeholder tile. Check the same behavior in a podcast. Rejoin as a viewer: older gifts should not replay.
6. Confirm an unfunded GC gift fails without changing either wallet. Remove B and ensure B is no longer a selectable recipient. End the broadcast and verify further sends fail.

On iPhone/Android the existing browser studio is still used for LiveKit video. Gift sending is in the Gather live panel; animations are visible in its browser studio. A signed native RTC app has not been produced by this ZIP. The browser handoff contains only its short-lived LiveKit token, not your Gather account session.

Validation: 74 automated tests passed, including one-time concurrent transfers, catalog pricing, wallet history, Test GC separation, recipient authorization, live event cursors, bans and ending. TypeScript and lint passed. Web, iOS and Android exports are built in this release; actual LiveKit playback and phone permission behavior still require the deployment check above.
