# Enable Gather Assistant

1. Deploy the updated server and client together using INSTALL-THIS-UPDATE.md. Keep the existing database, Render persistent disk and environment variables.
2. In Render, open the Gather web service → Environment.
3. Set CHAT_ASSISTANT_ENABLED to true.
4. Set CHAT_ASSISTANT_MODEL to gpt-5-mini (default). This is separate from OPENAI_MODEL used by the admin page managers.
5. Keep/add OPENAI_API_KEY as a server secret. The existing page-manager key can be reused if it has access and API billing configured. Never put it in an EXPO_PUBLIC variable or frontend source. ChatGPT subscription access is not a substitute for API billing.
6. Save and redeploy. Sign in with a verified member account and select Chat Assistant at the top of Gather. Ask how to join a Gathering voice party.
7. If the service is unavailable, check API model access and billing. Set CHAT_ASSISTANT_ENABLED=false to pause it.

No new npm package is needed for the assistant. The app uses Node's built-in fetch to call the OpenAI Responses API. Initial limits are 20 attempts/member/day and 200 app-wide/day, measured in UTC, four requests/minute/member, three concurrent requests, 2,000-character questions and bounded recent context. Failed provider attempts count toward the daily limit.

Only submitted text/recent chat is sent to OpenAI. The assistant has no live account lookup, web search, images, voice mode or action tools. Conversation clears on leaving the assistant; New chat also clears it. Usage counters are stored for up to seven days. AI answers can be wrong; it cannot diagnose a live room it cannot inspect.

GPT-5 mini was requested for this first version. Official OpenAI documentation lists its underlying 2025 snapshot as deprecated with shutdown December 11, 2026. Review available models and change CHAT_ASSISTANT_MODEL before that shutdown; no automatic model substitution is configured.

Official documentation checked October 11, 2026:
https://developers.openai.com/api/docs/models/gpt-5-mini
https://developers.openai.com/api/docs/guides/text
https://developers.openai.com/api/docs/deprecations
