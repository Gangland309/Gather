# Latest release: Gather v0.9.23

Gathering voice parties now support screen sharing in supported desktop browsers. See CHANGELOG-v0.9.23.md. Includes all previous updates.

Deploy server and client together using the instructions below, preserving the Render disk, database and environment variables. Refresh Gather and rejoin the voice party to obtain updated permissions. Go to Gathering → Voice party → Start/Join → Share screen, then choose a tab, window or screen. Stop sharing leaves the voice party connected.

# Latest release: Gather v0.9.22

Host desktop recording controls, timer, local download and a shared recording notice. See CHANGELOG-v0.9.22.md. Includes v0.9.21 features. Deploy server and client together using the steps below; keep the existing Render database, persistent disk and environment variables.

To record: open the live as host on desktop, inform speakers, check the recording confirmation, select Record live, choose the Gather tab with Share tab audio, then Stop recording and Download recording. Use Enable sound and headphones to hear guests while recording. Keep the tab open. Save each clip before recording another. Browser/phone compatibility is detected at runtime; phone-native and cloud recording are not included.

# Latest release: Gather v0.9.21

Includes active live users for battle invitations, automatic read status without deleting notifications, desktop Spark autoplay fallback, and admin-only bot controls. See CHANGELOG-v0.9.21.md and MUX-PLAYER-SETUP.md.

Deploy both the server and client using the installation steps below. Keep Render environment variables, persistent disk and the existing database. Do not replace production data with a blank database. After deployment refresh the browser and test with two accounts.

# Latest release: Gather v0.9.20

Original purple-and-lime colors restored. See CHANGELOG-v0.9.20.md and INSTALL-THIS-UPDATE.md.

# Latest update: 0.9.5

See MAP-UPDATE.md for member maps and full-screen sign-in artwork.

# Gather 0.9.4 · Tagging, Fan Clubs and sign-in artwork

See USER-TAGGING-UPDATE.md, FAN-CLUBS-UPDATE.md and INSTALL-THIS-UPDATE.md. Fan Clubs provide creator-defined perks, member-only details/links and posts, plus open/application membership. The supplied Gather artwork is bundled on sign-in/registration. Type @username in a post, photo/video caption, comment or Gathering post to tag someone. Matching accounts become profile links, with notifications that respect visibility and blocks. This cumulative update retains live totals, double/triple battle points, gifts, wallets and AI page managers.

# Gather 0.9.3 · Live totals and battles

See LIVE-BATTLES-UPDATE.md and INSTALL-THIS-UPDATE.md. This cumulative release adds exact live gift totals, consent-based timed battles, separate GC/Test GC scoreboards and 1×/2×/3× points. Earlier live gift, official page, AI manager, GC wallet and admin changes are included.

# Latest update: 0.9.2 live gifts and automatic official Gather page

See LIVE-GIFTS-AND-GATHER-PAGE.md. Gift buttons in the phone browser studio, creator-to-audience gifts, extra-bold announcements and automatic official-page setup. Includes AI managers, GC distribution and wallet access.

# Latest update: 0.9.1 live gift button fix

See LIVE-GIFT-BUTTON-FIX.md. Live studio includes Gift controls and inline browser sign-in; Shop Gifts can open Live. Previous AI managers, GC distribution and wallet updates are included.

# Latest update: 0.9.0 automatic AI page managers and wallet access

See AI-PAGE-MANAGERS-SETUP.md. Automatic AI text posts with three rotating writing roles, saved schedules, activity logs and pause controls. GC distribution has visible amount/review/confirmation controls. Me → GC Wallet and Settings expose balances and history. Requires a server OpenAI API key to generate content.

# Latest update: 0.8.9 admin content bot

The admin control panel includes the Gather content bot: generate, edit, save, discard and publish drafts as the official Gather page. Includes page setup and refresh controls.

# Latest update: 0.8.8 live gifts

See LIVE-GIFTS-UPDATE.md. Live viewers can send GC or Test GC gifts to a selected host or guest, with participant-specific animations and wallet receipts. Cash-out remains unavailable.

# Latest update: Gather 0.8.7

See COLOR-UPDATE.md for the new ivory/charcoal/copper scheme. See DISCORD-SETUP.md for Discord linking, mutual-friend status sharing, the private Discord command, default G avatars, and setup instructions. This includes the prior cumulative pilot/live/shop release.

Latest cumulative update: see [PILOT-UPDATE.md](PILOT-UPDATE.md) for changes, installation, service setup gaps, and the device test checklist.

# Gather 0.4

Start with [UPDATE-0.4.md](UPDATE-0.4.md) for the current features, limitations, and existing Render update steps.

## Local development

Requires Node 24 or newer.

```sh
npm ci
npm --prefix mobile ci
npm run server
```

In another terminal, run `npm run web` or `npm run mobile`. To verify: `npm test`, `npm run check`, `npm run lint`, and `npm run build:all`.

Production requires the email settings in `server/.env.example`, a persistent data disk, and HTTPS. Video/live are optional until provider credentials are configured.

Latest additions: Settings, direct calls, Messages & Calls combined logs, and browser sound controls. See SETTINGS-AND-SOUND-UPDATE.md.

Latest: personal marketplace posts, member GC wallets, owner-admin credit grants, themed gift previews, generated invitation links and external sharing.
