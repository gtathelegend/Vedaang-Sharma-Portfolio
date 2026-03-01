# Portfolio Backend

Production-ready Express + MongoDB backend for portfolio CMS-style admin management.

## Quick start

1. Copy `.env.example` to `.env` and fill in values.
2. Install dependencies and start the server.

## Scripts

- `npm install`
- `npm run dev`
- `npm start`

## Create admin user

Set `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` in `.env`, then run:

```
node scripts/create-admin.js
```

## Key API routes

- `POST /api/auth/login` (sets httpOnly JWT cookie)
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/projects` (filters + sort + pagination)
- `GET /api/projects/:slug`
- `POST /api/projects` (protected)
- `PUT /api/projects/:id` (protected)
- `DELETE /api/projects/:id` (protected)
- `PATCH /api/projects/reorder` (protected)
- `POST /api/projects/:id/analytics`
- `GET /api/categories`
- `POST /api/categories` (protected)

## Vercel deployment

`vercel.json` and `api/index.js` are configured for Node serverless runtime with Mongo connection reuse.
