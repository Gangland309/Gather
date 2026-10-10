# Update your existing Gather app

These instructions update your GitHub/Render app. Keep your original running folder as a backup. Do not delete your hosted disk or change DATA_DIR.

## 1. Prepare Render first
Open Gather > Environment > Edit. Confirm existing RESEND_API_KEY and EMAIL_FROM are retained. Do not paste the API key into chat or GitHub.

Set or confirm:
| Key | Value |
|---|---|
| PUBLIC_ORIGIN | https://gatherourworld.com |
| EMAIL_FROM | Gather <no-reply@mail.gatherourworld.com> |
| NODE_ENV | production |
| HOST | 0.0.0.0 |
| DATA_DIR | Your existing persistent disk path, normally /var/data |
| ADMIN_EMAIL | Your trusted owner account email |
| CORS_ORIGINS | https://gatherourworld.com,https://www.gatherourworld.com,https://gather-69ig.onrender.com |

SUPPORT_EMAIL is optional: set it only after you create the receiving inbox. Contact Us already works through the in-app queue.

Save environment changes before uploading the new server. The existing application may redeploy; that is expected. Check that the persistent disk is still mounted at the DATA_DIR path. Have a backup before the code update; a stopped-service copy of the SQLite files plus media is consistent, while copying a running SQLite database alone is unsafe. Do not use the new archive to replace user data.

## 2. Extract into a separate folder
Download this ZIP on your other computer and extract it. Open GitHub Desktop > your Gather repository > Repository > Show in Explorer.

Copy these files from the extracted gather folder into the matching locations in the cloned repository, replacing the existing files with the same names:
- mobile/App.tsx
- mobile/Policies.tsx
- mobile/assets/gather-logo.png
- server/server.mjs
- server/email.mjs
- server/social.mjs
- tests/api.test.mjs
- tests/features.test.mjs
- package.json
- .gitattributes and .gitignore (enable View > Show > Hidden items if needed)
- README.md and INSTALL-WINDOWS.md

No dependency changes are needed. Keep your existing mobile/package.json, package-lock.json, app.json, router files, .env files, and server/data. The ZIP also includes the full compatible source and prebuilt exports for reference, but the above is the minimal deployment update.
Do not upload node_modules, server/data, .env files, SQLite files, or uploaded photos to GitHub. App assets such as gather-logo.png are safe to upload.

## 3. Check and publish
Optional local verification from the cloned repository folder: `npm.cmd --prefix mobile ci`, `npm.cmd test`, `npm.cmd run check`, `npm.cmd run lint`.
In GitHub Desktop inspect the changed-file list. LF/CRLF notices are normal Windows text-format notices; .gitattributes keeps source files on LF going forward.
Commit with summary `Add Gather community and email features`, then Push origin.
If Render auto deploy is disabled, use Manual Deploy > Deploy latest commit. Wait for Live. Current build and start commands remain the same.

## 4. Test the live service
1. Open https://gatherourworld.com and hard refresh (Ctrl+F5).
2. Existing accounts can sign in and read content. They must verify their email before posting or messaging. Choose Resend verification email. Open the email link, click Verify email, then return to Gather and choose I verified my email.
3. The ADMIN_EMAIL account must also verify. Moderation should then appear after refreshing the account or signing in again.
4. Create a new test account with an email you can receive. Verify it and publish a post.
5. Sign out, choose Forgot password, and check that the email link changes the password and invalidates old sessions. Used links should fail when tried again.
6. On your Profile choose Change profile picture. On web use crop/zoom/position controls and Save; native uses the system crop editor.
7. With two accounts, repost a post and share its link. Open it in a separate browser window, sign in, and check the original author credit.
8. Send a message to someone who does not follow the sender. It should go to Requests. Accept, reply, and check unread counts. Try decline and block separately.
9. Report a profile/post/message and submit Contact Us. Check Moderation as the owner; reply and resolve a support request, then inspect the member’s Contact Us screen.
10. Restart the Render service after a test post/photo/message and confirm all remain. This verifies that your actual hosted disk is configured correctly.

If deployment fails, copy the non-secret error lines from Render logs. Do not remove the disk, reset the database, or paste secrets. A rollback must preserve the migrated database; additive tables and columns are compatible with the previous core application, but new-feature data is only shown by the new version.
