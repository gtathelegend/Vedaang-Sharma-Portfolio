# Vedaang Sharma - Portfolio

Personal portfolio and content-managed showcase for [vedaangsharma.dev](https://vedaangsharma.dev). Built with Next.js 15 (App Router) and React 19, backed by Supabase for auth, data and image storage, with a self-serve admin panel for managing every section of the site.

> **Version 2.0** - full-stack rewrite with a Supabase admin CMS.

## Highlights

- **Animated marketing site** - home, about, projects and contact, with scroll-snap sections, Framer Motion transitions and a grayscale-to-color hover treatment throughout.
- **Built-in CMS** - `/admin` panel for managing projects, categories, education, experience, skills, socials and global settings without redeploying.
- **Supabase backend** - Postgres for content, Auth (email/password) for the admin, and Storage for uploaded thumbnails/screenshots.
- **Spotify "Now Playing"** widget on the About page (server-side token refresh).
- **Dynamic OG images** generated at the edge via `next/og` - every share card is rendered on demand from query params.
- **SEO-ready** - metadata templates, Twitter / OpenGraph cards, and a gzipped sitemap generator.
- **Performance-tuned** - Turbopack dev, AVIF/WebP image pipeline, `sharp`, Vercel Analytics, Speed Insights, bundle analyzer, and security headers (`X-Frame-Options`, `X-Content-Type-Options`, `X-XSS-Protection`).

## Tech stack

| Layer        | Choice |
| ------------ | ------ |
| Framework    | Next.js 15 (App Router, Turbopack) |
| UI           | React 19, Tailwind CSS 4, Framer Motion, FontAwesome |
| Backend      | Supabase (Postgres, Auth, Storage) via `@supabase/ssr` |
| Data fetching| SWR + a small `fetchJson` helper |
| Images       | `next/image`, `sharp`, AVIF/WebP |
| Tooling      | ESLint 9, `@next/bundle-analyzer`, `cross-env` |
| Hosting      | Vercel (Analytics + Speed Insights) |

## Project structure

```
app/
  (root)/                Home page (hero, about preview, projects preview, contact)
  about/                 About page - bio, skills, experience, education, Spotify widget
  projects/              Project list, featured highlight, [slug] detail, archive
  admin/                 Login + dashboard + per-resource management screens
  api/                   REST handlers (projects, categories, education, experience,
                         skills, socials, settings, upload, auth/logout, og)
  layout.jsx             Root layout, fonts, analytics, metadata
components/              Shared UI: Navbar, Sidebar, Footer, Chat, ProgressBar, …
lib/
  api.js / adminApi.js   Client-side fetch helpers
  supabase/              client.js (browser), server.js (SSR), admin.js (service role),
                         mappers.js (DB → app shape)
middleware.js            Auth gate for /admin/*
generate-sitemap.js      Builds public/sitemap.xml.gz
public/                  Images, CV, OG fallbacks
```

The admin panel uses Next.js route groups (`(panel)`) so the layout is shared across all logged-in screens while the login route stays standalone.

## Getting started

### Prerequisites

- Node.js 18.18+ (Node 20+ recommended for Next 15)
- A Supabase project (free tier is fine)
- Optional: Spotify developer app for the Now Playing widget

### Install

```bash
git clone https://github.com/Vedaang17/Vedaang-Sharma-Portfolio.git
cd Vedaang-Sharma-Portfolio
npm install        # or pnpm install
```

### Environment

Create a `.env.local` at the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>   # server-only, never expose

# Spotify (optional - Now Playing widget)
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=<client-id>
NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET=<client-secret>
NEXT_PUBLIC_SPOTIFY_REFRESH_TOKEN=<refresh-token>
```

You'll need Supabase tables for `projects`, `categories`, `education`, `experience`, `skills`, `socials` and `settings`, plus a Storage bucket for image uploads. The shape is documented implicitly by [`lib/supabase/mappers.js`](lib/supabase/mappers.js) and the `/api/*` route handlers.

### Run

```bash
npm run dev              # start dev server (Turbopack) on http://localhost:3000
npm run build            # production build
npm start                # serve the production build
npm run lint             # ESLint
npm run generate-sitemap # write public/sitemap.xml.gz
ANALYZE=true npm run build  # open the bundle analyzer report
```

The first time you visit `/admin`, you'll be redirected to `/admin/login`. Create the admin user directly in the Supabase dashboard (Authentication → Users), then sign in.

## Admin panel

`/admin` is gated by [`middleware.js`](middleware.js) - unauthenticated requests are redirected to `/admin/login`, and an authenticated session on the login page is bounced to `/admin/dashboard`.

Resources you can manage:

- **Projects** - title, slug, year, description, tech stack, categories, thumbnail, screenshots, GitHub/live links, featured/visible toggles, sort order.
- **Categories** - taxonomy used to filter the project listing.
- **Education** & **Experience** - timeline entries shown on the About page.
- **Skills** - grouped technical skills with icons.
- **Socials** - links shown in the contact section, organised into tiers (primary / research & writing / credentials).
- **Settings** - global content (full name, tagline, hero subtitle, email, CV URL).
- **Image upload** - `/api/upload` proxies multipart uploads into Supabase Storage and returns a public URL.

## Deployment

The site is designed for Vercel:

1. Push to GitHub.
2. Import into Vercel and add the environment variables above.
3. The OG route (`app/api/og/route.js`) runs on the **Edge runtime**; no extra config needed.
4. (Optional) Schedule `npm run generate-sitemap` on each build via your CI or a Vercel build step.

## License

Distributed under the **GNU General Public License v3.0**. See `LICENSE` for the full text.

Copyright © 2025 Vedaang Sharma.
