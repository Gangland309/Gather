# Mux configuration for Gather uploads

Mux is separate from Render. Open https://dashboard.mux.com and create/sign into your Mux account. In Settings → Access Tokens, create a token for the environment you intend to use with Video read/write permissions. Copy the token ID and secret privately. In Signing Keys, create a signing key in that same environment and copy its ID and private key privately.

In https://dashboard.render.com open your Gather web service → Environment. Add:

- MUX_TOKEN_ID: access token ID
- MUX_TOKEN_SECRET: access token secret
- MUX_SIGNING_KEY_ID: signing key ID
- MUX_SIGNING_PRIVATE_KEY: complete signing private key returned by Mux (base64 form is supported)

Keep these on the server; do not put them in EXPO_PUBLIC variables or send them in screenshots/messages. Preserve the existing Render variables. Save the changes and deploy, then wait until Render reports Live and refresh Gather. Choose a small local video, press Upload selected video, wait for transfer and processing, then publish. PUBLIC_ORIGIN should match your primary Gather domain. All four Mux variables are required by this build's video configuration check. For pricing/account activation, inspect the current Mux dashboard before enabling paid usage.

Official instructions: https://www.mux.com/docs/core/make-api-requests ; https://www.mux.com/docs/guides/signing-jwts ; https://render.com/docs/configure-environment-variables
