# Gather v0.9.24

- Gather Assistant: a member-facing text chat for app help, bios, captions and content/Gathering ideas. Includes suggested questions, New chat and clear error states.
- Separate from admin-only page managers. It has no tools or access to account records, messages, wallets, contacts, location, live state or admin operations; it cannot publish or change anything.
- Uses server-only OpenAI Responses requests, default GPT-5 mini with low reasoning effort and an output cap. CHAT_ASSISTANT_MODEL is independent of the page-manager OPENAI_MODEL.
- Signed-in verified members only for AI requests. Disabled until the owner configures it. Limits: four requests/minute per member, 20 attempts per member per UTC day, 200 attempts across the app per UTC day and three simultaneous generations. Failed provider attempts count. Bounded messages/context and a 50-second provider timeout prevent uncontrolled calls.
- Chats remain in component memory and clear when leaving the assistant. The database stores usage counts, not chats. The current question and recent chat go to OpenAI; response storage is disabled, which does not guarantee no provider retention.
- Desktop and mobile top shortcuts: Party with Friends, Podcast, Go Live and Chat Assistant. Party with Friends opens Your Gatherings to choose/start/join a Gathering voice party. Podcast and Go Live open their existing setup; they do not turn camera/microphone on automatically.

Includes all previous updates. Follow ASSISTANT-SETUP.md to enable AI replies. Provider billing applies. Real OpenAI generation, visual QA and production deployment were not performed.
