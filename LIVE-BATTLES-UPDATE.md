# Gather 0.9.3 — live gift totals and battles

This is a cumulative source update. Deploy it to Render before these changes appear on your site. Existing accounts, posts, wallets and gift history stay on your existing persistent disk.

## What changed

- Every public live shows its total gift value and number of gifts. GC and Test GC totals are separate. Expand recipient totals to see individual amounts. Totals include speaker and audience gifts, using the original gift price, without the battle multiplier.
- Two joined speakers in one regular live can battle. Either speaker can challenge the other; the opponent must accept or deny. Choose 1, 3 or 5 minutes, GC or Test GC, and 1× standard, 2× double or 3× triple points before sending the challenge. Challenges expire after two minutes. One pending or active battle per live.
- Viewers see both names, scores, countdown, multiplier and winner/tie result. New viewer gifts to a competitor during the timer count: gift GC price × multiplier. A 5 GC gift scores 5, 10 or 15 points. The gift still costs 5 GC and the recipient receives 5 GC. Competitors cannot increase either score with their own gifts. Gifts to other speakers or audience members count toward live totals but do not score in the battle. GC gifts never score in a Test GC battle, or the reverse.
- Both competitors and the host can cancel. Removing/banning an opponent or making them ineligible cancels an unfinished battle. Ending a live cancels unfinished battles. A timer already completed keeps its result. Cancelled battles have no winner, and gift transfers remain in recipients’ wallets. This is a score competition, with no entry fee, wager, winner pot or automatic prize transfer.
- The server uses its own clock, committed gift receipts and exact integer arithmetic. Duplicate gift requests do not charge or score twice. Completed scores persist across server restarts. Old gift receipts populate totals once during migration.
- Results/totals refresh about every 1.5 seconds; visible countdown uses the server clock offset. If updates fail, the scoreboard warns that totals may be stale. Automatic finalization occurs on the next live gift/status request after the deadline; no late gift can add points.

Battles use two accepted speakers in the same live, which can still have up to six speakers. This release does not connect two separate live rooms or provide cross-room matchmaking. Podcasts retain eight-person capacity and are not battle rooms.

## Earlier updates included

The phone browser studio has gift controls and inline Gather sign-in. Creators can gift eligible signed-in audience members, and viewers can gift speakers. Gifts display an extra-bold announcement and animate at their recipient’s tile. The official Gather page is automatically created when the updated API starts; automatic AI page managers remain paused until configured/enabled. GC Wallet is in Me and Settings, and admin distribution retains its review/confirm step.

## Install on Windows / GitHub Desktop / Render

1. End active lives and back up your current project/database.
2. Extract the ZIP and open its `gather` folder. Copy its contents into your existing Gather repository, replacing matching source files. Preserve `.env`, existing data/uploads, and Render’s persistent disk.
3. GitHub Desktop → commit “Gather live totals and battles update” → Push origin.
4. Render build: `npm ci && npm --prefix mobile ci --include=dev && npm run build:web`. Start: `node server/server.mjs`. Keep `HOST=0.0.0.0`, `NODE_ENV=production`, `DATA_DIR=/var/data`, your persistent disk and existing provider credentials.
5. Wait for Render’s status to be Live. Refresh Gather, and close/reopen any old phone browser studio tabs to load the new code.

There are no new provider keys for battles. Working video still requires your LiveKit settings. OPENAI_API_KEY is separately required for automatic AI posting. GC purchases and cash-out remain disabled.

If /admin/official still returns HTTP 502, inspect Render runtime logs around the failed request. This release creates the official page on startup but does not diagnose the previously reported gateway error. Do not delete data or re-create your service to troubleshoot it.

## Try it safely

1. Sign in with a host and guest on separate browsers/devices; verify both accounts. Start a regular live, invite the guest and have them accept the live invitation.
2. As the admin, fund a third viewer’s Test GC wallet. A third account is required to test scoring because the two competitors’ gifts do not score.
3. Host → Start or manage a battle → select guest → Test GC → Double → 1 minute → Send battle challenge. Guest → Accept battle. Confirm both screens show the same names/multiplier.
4. Viewer → Gift → choose host or guest → Test GC → Spark → Send. Each Spark transfers 5 Test GC and scores 10 points. Replay/retry must not add an extra transfer or score.
5. Wait for the timer. Verify the winner or tie, then send another gift: live totals increase but the finished score stays fixed.
6. Start a new Triple Test GC battle. Each new Spark scores 15 points. Send a GC gift to confirm it does not change Test GC scores.
7. Try deny, cancel and remove-guest controls. Confirm cancellation has no winner and already received credits remain in wallet history.

Do the final camera/audio/gift visibility check on your actual iPhone and Android browsers after deployment. Expo exports in this ZIP are bundles, not signed App Store/Play Store installers.
