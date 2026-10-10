# Gather crisp UI update

The logo is larger and displayed in a white badge with a lime frame, including in dark mode. The header and bottom shortcuts have purple dividers. Feature navigation has distinct lime selected tabs, and cards/buttons have clearer edges, heavier labels, and consistent touch targets. All previous feed and social features are included.

# Gather feed and social update

The feed keeps Gather’s purple and lime identity with tall photo/video cards, overlaid captions, and a side rail for likes, comments, sharing, reposting, and reporting. Text posts remain supported. Vertical scrolling moves through posts.

Swipe left or right between Feed, Friends, Gatherings, Live, and Discover. Tap the horizontal feature strip for the same navigation. Swiping is paused while the Feed composer or Menu is open. This uses page changes rather than an animated continuous pager; there is no automatic video playback.

This update also includes dark mode (Menu: Dark mode or Use phone theme), online badges with My Account: Appear offline, friend requests and mutual-friend suggestions, bottom posting/live/gatherings shortcuts, and the consolidated Menu. Online presence expires after 75 seconds without a foreground heartbeat; private profiles and blocks are respected.

## Install on Render

1. Extract the ZIP. Copy the contents of its gather folder into your existing repository. Keep your .env files, database, uploads, and persistent Render disk.
2. Commit and push with GitHub Desktop.
3. Render build command: npm ci && npm --prefix mobile ci --include=dev && npm run build:web
4. Render start command: node server/server.mjs
5. Keep DATA_DIR=/var/data and existing email, video, live, and origin settings. Wait for Live, then refresh your browser.

For native iPhone/Android installations, build a new signed app binary to include updated native dependencies and appearance configuration. The archive is source code and exported bundles, not an APK or IPA.

## Verification and remaining work

36 backend tests, TypeScript, lint, and web/iOS/Android exports pass. Real-device swipes, appearance, camera, and provider-backed video/live calls still need device testing.

Photo/video editing, automatic spoken subtitles, and phone-number contact matching are not included. Permission-based email contact matching is included. These features still need additional implementation.
