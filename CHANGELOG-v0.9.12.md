Gather v0.9.12

Links in posts and reposts now display preview cards with a site title, description and thumbnail when available. Existing posts gain previews too. Up to three distinct links per post are previewed. Open Graph, Twitter card and normal HTML title metadata are supported. Sites without accessible metadata remain ordinary clickable links; missing images retain a text card.

Deploy BOTH server and client changes. No API key, extra dependency or database migration is needed. Metadata and image requests run on the backend; thumbnails are sent to the client as image data. Preview access checks existing post visibility. Network requests are limited to checked public IPv4 addresses, pinned to the verified address, with redirect revalidation, timeouts, response-size limits, request limits, a concurrency cap and bounded caching. IPv6-only sites are not previewed.

Includes v0.9.11 hover playback and one-video-at-a-time behavior on the current page, plus the layout correction, black background, clickable links and persistent login.

Verification: link preview parsing, thumbnail/cache/fallback tests, account-to-account API authorization, link parsing and video playback tests, TypeScript, lint and web export. Browser visual and live external-site validation remain pending.
