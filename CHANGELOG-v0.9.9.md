# Gather v0.9.9

- Persistent web login across browser closures; existing tab sessions migrate automatically.
- Sessions no longer expire automatically; active legacy sessions are upgraded on server startup.
- Temporary network/server failures preserve saved credentials.
- Sign out clears persistent and legacy browser credentials. Password reset and account suspension still revoke sessions.
- Removes v0.9.8 black theme and style wrappers; restores v0.9.7 styling with a light default and fresh theme preference key.

Deploy both server and rebuilt web client. Browser storage clearing/private browsing may require a fresh login. Real iPhone testing remains required.
