# Empty broadcasts and old notifications

The server checks LiveKit every 15 seconds. New broadcasts have 90 seconds to connect. After that, a room must be confirmed empty for at least 30 seconds before it ends. A newly issued join token adds 60 seconds of connection grace. A second participant check prevents ending a room when somebody has just joined.

Any connected participant keeps a live or podcast active, including viewers without an account and users with microphones or cameras off. This is not a silence-based timeout. Provider errors leave the broadcast intact for a later retry. Correct LIVEKIT_URL, LIVEKIT_API_KEY and LIVEKIT_API_SECRET settings are required for automatic room checks.

After a broadcast ends, its live-start and live-invite notifications are deleted. Reading notifications also removes old alerts linked to ended or missing broadcasts. Legacy alerts are matched to the most recent preceding broadcast from their sender; unmatched alerts are removed. Other notification history is retained. An open Activity screen refreshes every 15 seconds.

Deploy both server and client following INSTALL-THIS-UPDATE.md. Preserve the database and persistent disk. Automatic schema migrations add broadcast linkage and cleanup timestamps. No production deployment or actual LiveKit connection has been tested here.

After deployment: create a live and join from another account; confirm a muted viewer keeps it active. Leave all devices, wait for cleanup, and verify the room and its live alerts disappear. Repeat with a podcast. Check that ordinary social notifications remain.
