# Gather 0.9.13

- Website link cards can play HTTPS direct video/audio links and YouTube/Vimeo videos inside Gather. Provider videos use their official embedded players; generic webpages retain ordinary links.
- Starting a linked video stops the current HTML media; starting an HTML video closes provider playback. Only one provider player remains mounted at a time.
- Active Sparks start muted automatically and no longer pause when the pointer leaves. Swipe selects the next Spark; comments unmount playback.
- Reduced rectangular UI corner radii to 4px; existing circular avatars remain circular.
- Persistent sessions, black theme, responsive layout, clickable links and thumbnails retained.

Scope: external playback is implemented for the website, including iPhone Safari/home-screen use. Native iOS/Android builds retain external link cards without embedded external playback. Embedding restrictions, expired media links, unsupported codecs and browser autoplay policies can prevent playback; manual controls/original links remain available. Device and visual verification is pending.

Deploy both source updates and the included freshly exported mobile/dist website. This ZIP does not deploy automatically.
