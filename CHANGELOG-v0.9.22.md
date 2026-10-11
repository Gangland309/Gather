# Gather v0.9.22

Host recording added for public lives and podcasts in supported desktop browsers. Record live prompts for a browser tab; select Gather and enable Share tab audio. The tab captures the visible live layout, comments, gifts and other audible speakers. Gather mixes in the host's unmuted live microphone. The host confirms they have informed speakers and have permission before starting. Everyone on the web live sees a recording notice, refreshed every three seconds. Host-scoped control tokens are required to update it; stale notices expire after 30 seconds.

Stop recording leaves the live running and provides a local WebM/MP4 download, depending on browser support. The clip is not uploaded or published automatically. Local buffering stops at approximately 256 MB. Keep the screen open, stop and download before navigating away. Ending/leaving the room stops capture; closing the browser can lose the unsaved clip. A new recording replaces the previous download, so download first.

This release does not implement phone-native recording, cloud recording or replay storage. Captured tab audio is mandatory to avoid silently omitting other speakers. If the browser does not provide it, recording refuses to start and explains why. Private calls and voice parties do not expose recording controls.

Includes all v0.9.21 changes. No fix to the reported second-account live discovery issue is claimed: the exact symptom and shared-link result are still needed to identify its cause.
