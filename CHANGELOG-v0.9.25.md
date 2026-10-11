# Gather v0.9.25

Fullscreen availability for public lives, podcasts and Gathering voice parties, using the common browser room transport. Screen-share tiles stay visible and members can enlarge them using the existing speaker-box controls.

- Fullscreen / Exit fullscreen buttons are visible to hosts, guests and viewers.
- Uses native browser fullscreen where available; falls back to an in-app full-window dialog if the browser does not support or permits no native fullscreen.
- Keeps the existing live room and media elements mounted while changing views. Camera, microphone, screen sharing, sound settings, gifts and recording controls remain in the room view. Scroll to controls when needed.
- Escape exits native fullscreen or the expanded dialog. Exiting returns to the embedded room; it does not leave the room or change another member's layout.
- Fallback dialog uses the browser top layer so the view is not clipped by the app's scrolling panels. On unsupported older browsers, a fixed expanded view is attempted.
- Private calls using the same transport also receive the fullscreen view.

The native app still opens its existing browser live transport; no native video-room SDK or native fullscreen player was added. On some phones browser chrome may remain visible in the expanded view. Inactivity timers were not implemented; the five-minute rule was cancelled.

Includes Gather Assistant, top shortcuts, host local desktop recording, screen sharing and all earlier updates. Fullscreen browser/phone visual QA still needs testing after deployment.
