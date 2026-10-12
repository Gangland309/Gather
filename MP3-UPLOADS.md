# Music and audiobook uploads

Open + Post → Choose MP3 → select a file → enter title → Music or Audiobook → confirm you own it or have permission → Upload MP3 → wait for Ready to publish → choose audience → Publish. Your caption appears on the post. One photo, video or MP3 per post. Uploaded audio can be previewed before publishing.

MP3 only, up to 200 MB per file. Long audiobooks can be posted chapter by chapter. Up to five upload attempts and 512 MB of retained successful uploads per member per 24 hours. The progress bar stops at 99% while the server validates the file. Playback supports Play/Pause, seek, 15-second skips and 0.75×/1×/1.25×/1.5×/2× speed.

Web, iOS and Android player code is included. Native modules require rebuilding the native app (or a compatible Expo Go environment). Background/lock-screen playback, downloads/offline listening, chapter playlists and audiobook sales are not implemented in this release. Leaving a post unmounts its player. The gallery remains a photo gallery.

## Render storage

MP3 files use the existing server persistent disk, under DATA_DIR/audio. Set PUBLIC_ORIGIN to your HTTPS Gather domain and confirm DATA_DIR points to the mounted Render disk before allowing uploads. Audio uploads do not use Mux and require no new provider key. This version adds music-metadata to the server and expo-audio/expo-document-picker to the client, so install both dependency lockfiles and deploy server/client together. Back up the entire DATA_DIR, including audio and the database.

Storage grows as members upload files; monitor free disk space. Unpublished files older than 24 hours are reclaimed during a later audio upload (up to 50 per upload). Removing a pending MP3 deletes it immediately. Deleting a published post revokes public access immediately; its unreferenced file is eligible for later cleanup. Hidden/reported post files are retained while a post references them.

## Access

Audio inherits post audience and account/Gathering access rules. Metadata requires signed-in access unless a public shared post grants access. Playback links expire after 24 hours and are bearer links; avoid sharing raw playback URLs. Member links also require their issuing session to remain active. Permissions, bans and post visibility are checked again on each stream/range request. Reload audio to refresh an expired link. Already downloaded/buffered bytes cannot be recalled.

Only upload content you own, have licensed for sharing, or may legally distribute. Reporting and moderation work through the audio post's existing controls.

## Verification

Automated tests use a generated MP3 tone to check real uploads, invalid formats, ownership, audiences, byte ranges, HEAD, logout revocation, post deletion and upload limits. No production deployment or physical-phone/browser audio playback check has been performed.
