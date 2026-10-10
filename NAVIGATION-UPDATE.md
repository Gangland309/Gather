# Gather navigation update

Includes the prior 0.4 community update plus:

- On phones and smaller browser windows, a single compact Menu dropdown replaces the top tab row.
- Expandable folders: Connect, Community, My Space, Help; Home and Activity remain direct entries. Moderation appears only for administrators. Sign out is inside the mobile menu.
- Desktop uses the same expandable folders in its left sidebar.
- The dropdown scrolls on short screens; selecting a page or tapping outside closes it.
- Header plus button opens the Home post composer, scrolls to it, and focuses the caption/text field.
- Bottom shortcuts: Go Live, + Post, Gatherings. They stay above the bottom safe area and do not cover the scrolling content.
- Compact wordmark display saves header space.

Use the same installation process as UPDATE-0.4.md: copy the extracted gather contents into your existing repository, preserve secrets/data, commit, push, and wait for Render Live.

This archive does not yet add automatic subtitles, photo/video editing, or verified phone-number contact matching. Email contact matching from 0.4 remains included. Video/live still require provider configuration and phone live uses the browser.

TypeScript/lint and web/iOS/Android bundle exports are checked. The previous 34 backend tests passed; no backend code changed for this navigation update. Real browser/physical-device navigation acceptance testing remains outstanding.
