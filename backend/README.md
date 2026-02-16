# Portfolio Backend

## Quick start

1. Copy `.env.example` to `.env` and fill in values.
2. Install dependencies and start the server.

## Scripts

- `pnpm install`
- `pnpm dev`
- `pnpm start`

## Create admin user

Set `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` in `.env`, then run:

```
pnpm node scripts/create-admin.js
```
