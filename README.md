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
