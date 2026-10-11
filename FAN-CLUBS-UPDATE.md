Latest: 0.9.6 removes the supplied picture from authentication screens. Sign-in artwork notes below describe the earlier release.

# Gather 0.9.4 — Fan Clubs and sign-in artwork

This update includes @username tagging, earlier gift totals and 1×/2×/3× battles, gifts, wallets and automatic AI page managers.

## Fan Clubs

Open the main menu → Community → Fan Clubs. Search clubs or select My Fan Clubs. Anyone with a verified account can create a club and choose open membership or membership by application. The creator is its owner and initial member.

The creator selects “Set your club’s member perks” to add up to 12 perks. Each has a title, public summary, members-only instructions/details and an optional HTTPS link. Examples include early access, extra content, a member Q&A, a discount code or a resource link. These are custom benefits provided by the creator, not automatic payments or store discounts.

Visitors can browse a club’s name, creator, description and perk summaries. Only approved members can access its perk details/links and club posts. An open club still requires joining before its content is available. Pending applicants have no access. Joining never changes follow/friendship permissions or the creator’s account privacy.

Creator controls include membership applications, approving/rejecting requests, appointing moderators, member removal/bans, post moderation and inherited Gathering voice parties/reminders. Only the creator can edit perks and membership rules; moderators can manage members/content but cannot redefine perks. Members can leave; an owner cannot leave their own club.

Approved members receive Activity notifications when perks change, subject to their Gatherings notification preference. Re-saving unchanged perks does not send another notification. Applications, joins, approvals and club posts also generate Activity updates. Club notifications open the related club or post. Removed/blocked members lose access to member resources and are excluded from later notification reads.

Membership is free. There are no entry charges, subscriptions, automatic perk purchases, redemptions or cash-out changes. External perk links are protected by the destination site’s own access controls; members can copy content they can already access. The club creator is responsible for fulfilling advertised perks. Club deletion, ownership transfer and paid membership are not included.

Fan Clubs are separate in discovery, while the Home composer’s Gathering audience includes approved Fan Club memberships. Select a club there to publish photos/videos to its members. Regular public Gatherings keep their existing behavior.

## Sign-in image

Your exact uploaded “Find your people, gather your world(1).png” is included as `mobile/assets/gather-sign-in-artwork.png`. It replaces the former text hero on sign-in and registration. It is shown in full with contain scaling, beside the form on wide screens and compactly above it on phones. The same art is used in light/dark mode. There is no external image download requirement.

## Install this cumulative update

Follow INSTALL-THIS-UPDATE.md. Copy the ZIP’s `gather` contents into the existing repository; preserve `.env`, database/uploads and Render’s persistent disk. Commit and push with GitHub Desktop, wait for Render’s deployment to become Live, then refresh Gather. The database adds fan-club fields automatically, without replacing existing Gatherings or accounts. No new API keys are needed for tagging, Fan Clubs or the artwork.

## Check after deployment

1. Sign out. Verify the artwork is visible and uncropped on desktop and phone, then sign back in.
2. Community → Fan Clubs → create a club. Add a perk with a public summary, a private note/code and a valid HTTPS resource link.
3. With a second account, browse the club before joining: summaries visible, private note/link and posts unavailable. Join and confirm they unlock. Leave and confirm they become unavailable again.
4. Create an application-required club. Verify the second account stays pending until approval. Remove/reject a member and confirm they cannot access posts/perks or rejoin while banned.
5. As creator, update a perk. The approved member should receive one Activity update opening the club. Turning off Gatherings notifications should suppress new club updates.
6. Test tagging in a club post; an outsider must not get a mention notification or gain access.

Camera/audio/provider connectivity and actual mobile UI still need testing on your configured devices. If /admin/official still returns HTTP 502, capture Render runtime logs; this release does not diagnose that prior gateway error.
