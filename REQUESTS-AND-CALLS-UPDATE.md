# Requests, profile links and call history · 0.8.3

Includes all prior updates. Connect → Requests collects incoming friend requests, private follow requests, message requests, call invitations, live guest invitations and podcast speaker invitations. Accept and Deny are separate labeled buttons. Existing server recipient checks remain enforced; a new recipient-only deny endpoint clears live/podcast invitations without granting publishing permission. Gathering applications stay in the host/moderator tools.

Accepting a call or live invitation opens its section. Choose the accepted room/broadcast there to connect; camera and microphone remain off until enabled. Requests refresh every 15 seconds while the section is open. Activity request notifications open Requests.

Profile names/pictures now open profiles across feed headers, Sparks author labels, comments, friend lists, requests, message headers/list names, community member names and posts, shop seller labels, call hosts/history, and public post authors. Existing private account and block restrictions still apply.

Connect → Calls includes All calls and Missed calls. Records are private to the caller and recipient. New calls track incoming/outgoing direction, start time, acceptance, ending, denial, cancellation and missed status. Unanswered invitations expire after one minute, checked when room/history polling or another room request runs. Missed-call notifications appear in Activity. Accepted sessions expire after the existing two-hour room limit. Provider room cleanup is attempted on expiry. History covers new calls after installing this update and shows the latest 100. Duration is acceptance-to-session-end time, not measured connected audio time. There is no OS background ringing or device call-log integration.

Install using INSTALL-THIS-UPDATE.md. Database tables are created automatically; preserve your existing database and uploads. No production deployment or physical phone/provider test was performed here.
