# Feature plan

## Product definition

An all-in-one network where one profile connects conversations, photos, short videos, communities and private messages. The first release should serve a specific community; "everybody" is not a useful initial audience. The working name Gather is a placeholder, not a name availability or trademark claim.

Default choices for this first code release: chronological feeds, public posts to signed-in members, open account registration, no ads, no algorithmic ranking, no paid features. Audience, age policy, private accounts and business model remain product decisions.

## Scope and status

| Area | Included in this working code | Next launch MVP | Later expansion |
| --- | --- | --- | --- |
| Accounts | Register, login, session expiry, logout | Verified email, recovery, deletion, verified admin roles | Additional sign-in methods, two-factor authentication |
| Profiles | Username, display name, bio, follows | Avatar/banner uploads, private accounts and approval | Creator/business profiles, verification workflows |
| Feed | Chronological Everyone and Following, pagination | Mute, bookmarks, accessibility/device refinement | Recommendations with user controls |
| Publishing | Text, one photo, own-post deletion | Multiple photos, post editing, hashtag search | Polls, drafts, scheduling |
| Video | Not implemented | Upload short video, process, play, moderate | Full-screen clips feed, captions, effects |
| Stories | Not implemented | After the core launch MVP | 24-hour stories, audiences and highlights |
| Communities | Not implemented | Groups, membership roles, group posts | Events, community discovery |
| Messaging | Not implemented | One-to-one text DMs and inbox | Group chat, attachments, calls |
| Activity | Likes/comments/follows, read status | Push notifications, preferences | Digests |
| Trust | Block/unblock, report post, admin hide/dismiss | Account suspension, audit trail, abuse handling | Appeals and mature moderation operations |
| Live | Not implemented | After launch MVP | Streaming provider, chat, moderation, replay |
| Money | Not implemented | After proving retention | Subscriptions, tipping, ads, creator payouts |

## Next feature acceptance criteria

**Identity:** registration proves email ownership, recovery tokens are single-use and expire, account deletion handles authored content and media, and administrator privileges require a verified owner-controlled identity. No public launch before this is complete.

**Short video:** a member can select and upload a video, see processing state, and play a processed clip on each target platform. Failed processing is visible and recoverable. Enforce duration/size limits server-side; generate thumbnails and streaming versions; support report and takedown. Use background jobs and object storage rather than keeping transcoding inside the API process.

**Direct messages:** only participants can read a conversation; nobody can add themselves using a guessed ID. Blocks prevent new messages. Add an inbox, delivery feedback, pagination, reporting and notification controls. Don't claim end-to-end encryption unless it is actually implemented and reviewed.

**Groups:** each group has owner, moderator and member roles. Private groups enforce membership on every read and write. Invitations and removals are auditable. Group posts follow the same moderation policy as the main feed.

**Stories:** stories expire according to server time, support visibility rules and reporting, and expire in both database access and media access. A disappearing UI does not constitute deletion.

**Live and payments:** introduce only after normal posting, account support and moderation are dependable. Payments need provider integration, webhooks, reconciliation and chargeback handling. Livestreaming needs a provider and live abuse response.

## Build order

1. Harden identity and account lifecycle; define target audience, name and moderation rules.
2. Launch-quality media pipeline and short-video screen.
3. Private messaging, with participant checks and blocking.
4. Groups and community roles.
5. Stories and push notification preferences.
6. Livestreaming and monetization when usage justifies their cost.

## Definition of a release-ready MVP

Two unrelated users can safely create verified accounts, manage profiles, publish text/photos/videos, follow, comment, message, join groups, report abuse and delete their data. The owner can moderate and restore from backups. Core flows pass on a real iPhone, Android device and browser. Hosting, privacy terms, operational ownership, store packaging, support and monitoring are in place.

The current code fulfills the foundation column above. It does not fulfill this release-ready definition yet.
