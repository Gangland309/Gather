# Gather v0.9.17 — live feed thumbnails

Active broadcasts display a recent host-camera snapshot in the dedicated Live feed and in live cards mixed between posts and Sparks. Tap the thumbnail to watch. Captures update about every 15 seconds from the browser live studio, and feed lists refresh about every 10 seconds. Only the host's camera is captured; guest cameras, private calls and voice rooms are excluded. No audio is included and opening the feed does not connect to every broadcast.

Camera-off, missing or snapshots older than 45 seconds use the Gather placeholder. Stopping the live removes its preview. Host control tokens authorize uploads; guest/viewer accounts cannot replace thumbnails. Existing live visibility, blocking and bans apply to returned previews. Thumbnails are small JPEG data URIs stored in SQLite with expiry checks; capture failures do not interrupt the broadcast. These are periodic still frames, not live video previews or recordings.

Works in web/phone browsers, including the installed app's existing browser live handoff. Native feed cards can display snapshots; direct native camera-frame capture is not added. Existing public-broadcast confirmation covers the public preview. Recent captures may remain visible until the next feed refresh or expiry after camera shutdown.

Deploy server AND client using INSTALL-THIS-UPDATE.md. The black app background is removed. The app opens in a coordinated light-gray/white palette with blue accents, matching logo and Find Your People header. Theme preferences are reset once to Light under a new preference key; optional Dark uses deep charcoal rather than true black. Logo and media-player backgrounds remain black for contrast. Real-camera, real-broadcast and phone validation remain pending.
