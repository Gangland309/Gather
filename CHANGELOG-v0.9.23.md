# Gather v0.9.23

Screen sharing in Gathering voice parties:
- Approved members who join the voice party can share a tab, window or screen from a supported desktop browser.
- Share screen and Stop sharing controls are distinct from microphone controls. Browser Stop sharing updates the control state through LiveKit unpublish events.
- Shared screens appear as labeled tiles. Tap a tile or choose its largest-box button to enlarge it for your view. Multiple speakers can publish separate screen tracks.
- Browser tab audio is requested when available. The picker discourages capturing Gather itself and excludes system audio where the browser honors those hints, to reduce echo. Share a different tab with Share tab audio enabled when you want its sound.
- Voice-party tokens now permit microphone, screen-share video and screen-share audio. Camera publishing stays disabled. Existing membership checks, bans, eight-speaker capacity and removal/token-revocation rules remain.
- Private-call and public-live publish grants are unchanged.

Use Gathering → Voice party → Start/Join → Share screen. Browser permission is required each time. Phone-native screen capture is not implemented; the native app uses its existing browser handoff, and mobile browsers may not support sharing. Viewing shared screens is handled by the existing video transport.

Includes v0.9.22 host recording and all earlier updates. Deploy server and client together and rejoin existing voice parties to receive new token permissions.
