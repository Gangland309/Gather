# Architecture and API

## Current structure

One Expo SDK 57 / Expo Router / React Native / TypeScript client targets web, iOS and Android. It calls a JSON HTTP API written in Node.js 24 using built-in modules. SQLite stores records; a local directory stores images. This keeps a real multiuser development system runnable without external service credentials.

The shared screen uses Expo Router URL parameters for its tab and selected profile, so navigation state has a URL. There is one backend process, no background job queue and no push delivery. In-app notifications are refreshed when the Activity screen opens or Refresh is pressed. Feeds use descending post IDs for stable cursor pagination and contain at most 20 posts per request. Comment retrieval shows the most recent 100 comments; it is not yet a complete paginated comment history.

## API contract

All endpoints below require `Authorization: Bearer <token>` except health, registration and login. Requests with bodies use JSON. Success responses currently use HTTP 200; errors use `{ "error": "..." }` with 400/401/403/404/409/413/415/429/500 as appropriate.

| Method | Path | Behavior |
| --- | --- | --- |
| GET | `/api/health` | Process liveness |
| POST | `/api/auth/register` | `{email,password,username,displayName}` → `{token,user}` |
| POST | `/api/auth/login` | `{email,password}` → `{token,user}` |
| POST | `/api/auth/logout` | Revoke current session |
| GET / PATCH | `/api/me` | Read own profile / replace `{displayName,bio}` |
| GET | `/api/users?q=...` | Search usernames and display names, up to 30 |
| GET | `/api/users/:id` | Read a visible profile |
| PUT / DELETE | `/api/users/:id/follow` | Follow / unfollow, idempotent |
| PUT / DELETE | `/api/users/:id/block` | Block / unblock; blocking removes follows both ways |
| GET | `/api/blocks` | Own blocked list |
| POST | `/api/uploads` | `{base64}` → staging upload `{id,url}` |
| GET | `/api/posts?following=true&author=...&before=...` | `{posts,nextCursor}`; all query filters optional |
| POST | `/api/posts` | `{body,mediaId?}` → post |
| DELETE | `/api/posts/:id` | Delete own post and dependent interactions |
| PUT / DELETE | `/api/posts/:id/like` | Like / unlike → updated post |
| GET / POST | `/api/posts/:id/comments` | Recent comments / create `{body}` |
| POST | `/api/posts/:id/report` | `{reason}`; one report per reporter per post |
| GET | `/api/notifications` | Most recent 100 visible activities |
| POST | `/api/notifications/read` | Mark own activity read |
| GET | `/api/admin/reports` | Owner-only unresolved queue, up to 100 |
| PATCH | `/api/admin/reports/:id` | `{hidePost: boolean}` → hide or dismiss and resolve |

Media GETs use `/media/<uuid>.<extension>` and can be fetched without a token **only while a visible post references the upload**. Photos are public by URL, not a private content system. Blocking hides posts, profiles, comments, counts and activity through the API; it cannot revoke an image someone already downloaded. Hiding/deleting the only referencing visible post stops subsequent media serving.

## Data model

`users` owns profiles. `sessions` stores token hashes and expiry. `uploads` belongs to its uploader. `posts` belongs to its author and optionally references an upload. `likes`, `follows` and `blocks` use composite unique keys. `comments`, `reports` and `notifications` reference their subject posts and people. Foreign keys and uniqueness constraints enforce integrity.

SQLite uses WAL mode. Queries bind values rather than interpolating user input. Follow/like actions and their notifications execute in transactions. Passwords use asynchronous scrypt with random salts; session secrets are random 256-bit values and are stored hashed in the database. Sessions expire after seven days and logout revokes the active session.

## Limits and incomplete production work

- No email verification/recovery, social login, account deletion, suspension, appeals or administrator audit log.
- `ADMIN_EMAIL` is a development access mechanism. Use verified identities and durable role assignments before deployment.
- No private profiles or private media. All permitted signed-in members can browse visible public posts.
- Upload validation checks size and image signatures; it does not fully decode, strip metadata, normalize dimensions, scan content or clean abandoned staging uploads. Production needs that pipeline and quotas.
- Synchronous SQLite and filesystem operations suit this starter. Benchmark before scaling; add PostgreSQL/object storage/jobs for a multi-instance platform.
- Rate limits are per socket IP and live in one process. Add shared limits and a deliberately configured trusted proxy. Do not blindly trust forwarded IP headers.
- Web bearer tokens are in memory. A hosted browser release should use a reviewed session design, normally secure HttpOnly cookies with CSRF protection for cookie-authenticated actions.
- No HTTPS terminator, distributed deployment, monitoring, operational alerts, automated backup/restore jobs or CDN is supplied.
- Image files can remain on disk after deleting their last post; the media endpoint stops exposing them. Physical retention/erasure requires an explicit cleanup policy and job.
- The API does not implement a versioned migration system. Introduce migrations before changing the persisted schema.
- App identifiers and template icons are development placeholders. Replace them before store builds. Do not publish the starter as a fully launched social network.

## Hosted direction

Use HTTPS for the web and API. Keep the API and database on durable infrastructure, media in object storage with deliberate access rules, and video processing in background workers. A hosted pilot requires identity verification, monitoring, tested restores, role-based moderation, device QA and a security review. Native packages require signing credentials and store distribution configuration. The export command produces JavaScript/Hermes bundles, not signed installation packages.
