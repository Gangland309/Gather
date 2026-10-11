# Gather v0.9.21

- Battle setup lists users actively present in public live broadcasts, refreshes every 10 seconds, and lets the host invite them into the current live. Appear-offline, expired-presence, blocked and banned users are excluded. Once the invite is accepted, select the joined speaker and send a consent-based battle challenge. This release uses same-room battles, not automatic linking of separate rooms.
- Opening Activity marks the loaded notifications read automatically. History stays intact. Batch reads affect only the selected IDs owned by the signed-in user; newer arrivals remain unread. Mark all read remains available.
- Desktop Sparks wait for asynchronously loaded video to become playable before starting muted playback. When the browser blocks autoplay, an explicit Play Spark button appears. Native video controls remain available.
- Admin panel routes and bot controls are restricted to admin users in the UI. Server-side authorization remains required for every bot operation.
- Original purple/lime colors and all earlier features retained.

Mux Player itself is not installed in this update. Read MUX-PLAYER-SETUP.md for the additional integration work.
