# Gather refined UI update

This release replaces the bright purple/lime interface with charcoal, slate, cool white, and restrained blue-gray accents. Dark mode uses neutral charcoal surfaces. Cards are flat with fine borders, corners are less rounded, headings use calmer weights, and active feature tabs use a subtle fill with a clear underline. The original Gather logo stays prominent in a clean white frame, with no lime outline or glow.

All previous feed, swipe navigation, account, and social features are included. Live streaming still requires the three LIVEKIT settings in Render; a design update does not configure the streaming service.

# Gather feed and social update

The feed uses tall photo/video cards, overlaid captions, and a side rail for likes, comments, sharing, reposting, and reporting. Text posts remain supported. Vertical scrolling moves through posts.

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
