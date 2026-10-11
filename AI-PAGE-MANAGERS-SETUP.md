# Gather 0.9.2 — Automatic AI page managers, GC distribution and wallet access

## Turn on automatic AI posts

1. Deploy this update using INSTALL-THIS-UPDATE.md. Keep your database, uploads, environment settings and persistent disk.
2. In Render → your Gather service → Environment, add OPENAI_API_KEY with your OpenAI API project's secret key. Keep it on the server; do not paste it in an EXPO_PUBLIC variable, chat, a post or your repository.
3. Add OPENAI_MODEL=gpt-4.1-mini, or another Responses-compatible text model your API project can access. Save and redeploy. Your OpenAI API project needs access and billing for generation.
4. Sign in as the verified owner admin. ADMIN_EMAIL in Render must match that login email. Sign out/in after changing it.
5. Open **Admin panel**. The official Gather page is automatically created on API startup. Existing page identity and posts are preserved. The manual setup button remains as an idempotent fallback.
6. At the top, open **AI page managers**. Choose topics, tone, interval and daily attempt limit. Defaults: every eight hours, up to three generation attempts per rolling 24 hours.
7. Choose **Drafts only**, save settings and press **Generate an AI draft now** to test the key. Watch AI activity until the job becomes draft. Press Refresh drafts in Gather content bot to review it.
8. When ready, choose **Automatic public posts**, check the public-post consent box, and press **Start AI managers**. The first scheduled run is one interval later. To publish immediately, check the consent box again and press **Run now · publish as Gather**.
9. **Pause all AI managers** stops future automatic posts. A result already being generated can become a draft instead of publishing. Changing saved settings also prevents an in-flight result under the old settings from publishing.

Three writing roles rotate: Community conversation bot, Interest discovery bot and Gather feature guide bot. They share one schedule, topic list, tone and rolling daily cap for the official Gather account. This release generates original text; image/video generation, Spark creation, comment replies, direct messages and automated user moderation are not implemented. Text posts are not falsely presented as video Sparks.

## Running, costs and recovery

The scheduler runs in the Gather Node server and checks every 30 seconds. The admin panel can be closed. The server must stay running for scheduled posts. If the hosting service sleeps or stops, nothing runs during that period; on restart one overdue job may run, then the interval restarts. It does not flood the feed with every missed slot. Scheduled state and results live in SQLite on your existing persistent disk.

Each AI run may incur OpenAI generation charges. The attempt cap is a usage count, not a dollar-budget guarantee. Failed attempts count toward it. Output is capped at 700 tokens. Set spending controls in your API project as needed. The activity log keeps the latest 30 runs visible; full run records remain in the database.

OpenAI content moderation screens generated posts. Provider errors, flagged/invalid content and exact duplicate text do not publish; a failed run pauses that settings version. Correct the cause and explicitly restart. An interrupted generation is recorded after two minutes and pauses the manager instead of automatically retrying a possibly billed request. Failed runs are not retried in a loop. The system prevents concurrent workers from claiming the same run and records the post and run status atomically. Moderation is not a factual verifier; review the feed periodically.

Only operator settings and up to eight recent public official-page post bodies are sent to OpenAI. Private member posts, messages, contacts, wallet balances and credentials are not included. Prompts constrain the bot to community conversations and documented Gather features, without invented news, rewards or member activity. Generated external links are held. The manager cannot alter permissions, wallet funds or member accounts. A paused draft-only queue is limited to 28 pending drafts; review existing drafts to make room.

## GC distribution fix

In **Admin panel → Admin GC distribution**:

1. Enter a username, press Find recipient and select the recipient.
2. The **Amount to give** field is always visible. Enter whole credits, choose GC or Test GC, choose a purpose and enter a reason of at least five characters.
3. Press **Review credit grant**.
4. Review the recipient, amount and reason, then press **Confirm and distribute**.
5. Success displays the issued amount and updated recipient wallet. Refresh GC audit history to see the entry. If a response fails, retry the same confirmation before editing the grant; the request key prevents duplicate issuance.

Recipient balance-loading failure no longer hides the form. GC and Test GC remain separate. Internal live gifts are enabled; shop checkout, purchased credit funding and cash-out remain disabled.

## Find your wallet

- Desktop: expand **Me → GC Wallet**.
- Phone: open the main menu, expand **Me**, choose **GC Wallet**.
- **Settings** also shows **My GC wallet** first.
- Credit-grant notifications now open the wallet directly.

Each user sees their own GC and Test GC balances and signed grant/gift history. Use **Refresh wallet** after distributing credits. The wallet is not a bank account or enabled cash-out balance.

## Validation

Automated provider tests use controlled fake responses; no live OpenAI call or billable request was made during development. Actual API credentials, generation, deployed UI and LiveKit/phone playback require your deployment test. See VALIDATION.md for the completed code checks.

Official API documentation: https://developers.openai.com/api/docs/guides/text and https://developers.openai.com/api/docs/guides/moderation
