# Install or update Gather on Windows

For your existing Render site, follow UPDATE-0.4.md. Copy the new source into your GitHub Desktop repository and use the updated Render build command; keep the data disk and existing secrets.

For local testing, extract the archive, open PowerShell in its gather folder, and run:

```powershell
npm ci
npm --prefix mobile ci
npm run server
```

Leave that terminal open. Open a second PowerShell in the same gather folder and run `npm run web`. Use the URL Expo prints. For phone testing run `npm run mobile` with the mobile API URL pointing to your hosted Gather server.

This download contains source and exported bundles, not signed iPhone/Android installers. Video/live need the provider configuration described in UPDATE-0.4.md.
