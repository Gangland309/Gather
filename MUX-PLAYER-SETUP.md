# Mux Player for Gather web

Guide checked October 11, 2026:
https://www.mux.com/docs/guides/mux-player-web#quick-start
Signed playback:
https://www.mux.com/docs/guides/secure-video-playback

Gather already requests signed Mux video streams and renders them with HTML video and hls.js. Mux Player is a different web player interface. It is not installed in v0.9.21, and it does not automatically fix provider failures or expired credentials.

## Owner steps

1. In Render, open the Gather web service, then Environment. Keep the existing MUX_TOKEN_ID, MUX_TOKEN_SECRET, MUX_SIGNING_KEY_ID and MUX_SIGNING_PRIVATE_KEY. They must belong to the same Mux environment as the uploaded assets. Do not put these secrets in frontend code or EXPO_PUBLIC variables.
2. No new Render switch enables Mux Player. Complete the code changes below before deploying it.
3. After integration, deploy the updated server and client, reload Gather, and test a ready uploaded video and a Spark on desktop. Also confirm a private video remains unavailable to unauthorized accounts.

## Code changes required for integration

From the Gather project directory, install the React web package:

```powershell
npm --prefix mobile install @mux/mux-player-react@latest
```

Then change mobile/VideoPost.web.tsx to import MuxPlayer from @mux/mux-player-react. Render it using the actual asset playbackId, Gather accentColor, muted autoplay for Sparks, looping, playsInline, and the signed playback tokens.

Extend the existing authorized /videos/:id response to expose playbackId and short-lived playback/thumbnail tokens while retaining signed URLs for the native player. Generate tokens only on the server, after the same audience and ownership checks. Signed assets need valid JWTs; a playbackId alone is insufficient. Add storyboard tokens only if hover previews are enabled, with the correct token audience.

Preserve retry/error controls, captions, pause-other-videos behavior and teardown when leaving a Spark. Mux Player uses a custom element, so existing HTML-video event coordination needs adaptation and browser testing.

Run npm test, npm run check, npm run lint, and npm run build:all before deploying. Verify playback in desktop Chrome/Edge and Safari, plus mobile browsers. Native iPhone/Android playback stays in the native player; this React web package is not a React Native UI component.

Gather's interactive lives and battles currently use LiveKit. Mux Player does not replace that multi-user room system. Broadcasting a LiveKit room through Mux would require a separate streaming integration.
