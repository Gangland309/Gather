Latest: 0.9.6 removes the full-screen sign-in artwork. The opt-in maps below remain included.

# Gather 0.9.5 — Member maps and sign-in background

Community → Map lets an approved member select a Gathering or Fan Club and view voluntarily shared member locations. The same map appears inside a group's location panel. Tap Load in-app map, drag to pan, use zoom buttons, and select a pin or Center on a member. Selected member details link to their profile and show snapshot time, expiry and accuracy.

Sharing is off by default. Use Privacy · Location in the Map tab or My Account to enable it, select approved groups, choose 15 minutes or one hour, and explicitly allow device location. Stop sharing in a group or everywhere; disabling account location deletes all shares. No background tracking or automatic GPS collection. Expired pins disappear locally each second. Membership, blocks, bans and account suspension are enforced by the existing server endpoint. Updates poll every 15 seconds; other members can retain a previously seen snapshot, and copied locations cannot be recalled.

Map tiles load only after an explicit button press. OpenStreetMap receives the viewer's IP and viewed area; member names and pins are rendered locally. Tiles are fetched only for the visible viewport, with no offline download or prefetch. Attribution remains visible. Native requests identify Gather; web requests send only the origin as external referrer through strict-origin-when-cross-origin. Requests use normal platform HTTP caching. OSM is a best-effort shared service; verify actual native HTTP cache behavior and plan a suitable hosted tile provider before a large rollout. The initial view centers on the first active member; use member centering to find people elsewhere.

The supplied Gather artwork now covers the whole sign-in and registration screen, with a subtle dim layer and a readable form card. Cover scaling intentionally crops parts of the image on wider displays.

Deploy to Render and test on real phones: grant/deny location, allow one group only, pending/removed membership, stop sharing, expiry, blocked users, dragging and zoom, map provider failures, image crop, keyboard and registration scrolling. No deployment or real-device testing has been performed in this update.
