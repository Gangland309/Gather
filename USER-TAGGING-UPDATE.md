# Gather 0.9.4 — tag other users

This cumulative ZIP includes the previous live gift totals, timed 1×/2×/3× battles, creator/audience gifts, GC wallets, admin distribution and AI page managers.

## Tagging

Type `@username` in a post, photo/video caption, comment, or Gathering post. Start typing a username at the end of your text to see matching suggestions; tap a suggestion to insert the complete handle. Suggestions are also available when editing your own caption and composing a manual Gather announcement. You can type a complete tag anywhere in the text without using suggestions.

- Matching tags are highlighted profile links. They work in the feed, Sparks-style captions, original repost text, post detail, comments, Gatherings and public/official page views. Unknown handles remain plain text.
- Tagged users receive Activity notifications: “tagged you in a post” or “tagged you in a comment.” Open goes to the associated post.
- Up to ten different handles per post/comment. Matching is case-insensitive; repeated handles notify a person once per post/comment. Caption edits notify newly tagged people. Removing/re-adding the same person does not repeat that post’s notification.
- Self-tags do not notify. Blocked or suspended accounts are excluded from lookup/linking. Emails and URL paths are not tags. Handles use the account’s username, not display name.
- Tagging does not change your audience or approve friendship/follow requests. Notifications are sent only to people who can already view the associated post. Private Gathering outsiders and people outside friends/private-follower audiences do not receive a mention notification. Only-me posts cannot notify another person.
- Notification preference Settings → Notifications → Social also controls tagging notifications. When someone loses access to a post, its notifications are filtered out on later Activity loads.

Tagging is implemented for posts/captions/comments. Shop listings, direct messages, bios and live chat are not mention-notification contexts in this release. AI-generated or content-bot draft posts are not connected to mention notifications; manual Gather announcements are. Existing text may render recognized handles as links after this update, but no retroactive notifications are sent.

## Install

1. Back up your project/database and end active broadcasts.
2. Extract the ZIP. Copy the contents of its `gather` folder into your existing Gather repository, replacing matching source files. Preserve your `.env`, database, uploads and Render persistent disk.
3. GitHub Desktop → commit “Gather user tagging update” → Push origin.
4. Keep Render’s build command `npm ci && npm --prefix mobile ci --include=dev && npm run build:web` and start command `node server/server.mjs`. Keep `HOST=0.0.0.0`, `DATA_DIR=/var/data` and your existing environment/provider settings.
5. Wait for Render to say Live, refresh Gather, and reopen old phone browser studio tabs. New tables are added automatically. No new API keys are needed for tagging.

## Check with two accounts

Create a public post mentioning the second account. Confirm its tag opens that profile and the second account sees an Activity notification. Repeat the same tag in one comment: it should notify once for that comment. Edit the caption and confirm that retaining or re-adding the same tag does not create another post notification.

Then make an Only-me post tagging the second account: they must not receive a notification or gain access. Check a private Gathering before and after approving the second account’s membership. Block the second account and confirm suggestions omit them. Turn off Social notifications and confirm new tag notifications are suppressed.

This ZIP contains source and platform exports, not signed mobile installers. Real-device camera/audio/notification presentation should be tested after deployment. The earlier /admin/official HTTP 502 still requires Render runtime logs if it continues.
