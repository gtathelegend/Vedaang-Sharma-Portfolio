# Dynamic Portfolio Setup Guide

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Copy your project URL and API keys from **Project Settings → API**.

## 2. Set up the database

Open the **SQL Editor** in your Supabase dashboard and paste the contents of `supabase/schema.sql`. Run it to create all tables.

## 3. Create your admin user

In the Supabase dashboard:
- Go to **Authentication → Users → Add User**
- Enter your email and a strong password
- This is what you use to log in at `/admin/login`

## 4. Configure environment variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

Required variables:
- `SUPABASE_URL` – your project URL
- `SUPABASE_SERVICE_ROLE_KEY` – service role key (server-only, never expose in browser)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` – public anon key

## 5. Run the project

```bash
npm run dev
```

## 6. Add your portfolio data

1. Open `http://localhost:3000/admin/login`
2. Log in with the Supabase Auth credentials you created in step 3
3. Add your:
   - **Projects** – with title, slug, description, tech stack, images, GitHub/live links
   - **Skills** – grouped by category (Web, API, AI, Mobile) and type (Technology/Tool)
   - **Experience** – work history with company, position, dates, description
   - **Education** – university, degree, GPA, achievements
   - **Socials** – social media links with FontAwesome icon names

All data appears automatically on the frontend.

## Category reference

### Projects
- `web` – Web Development
- `ai` – AI & Machine Learning
- `other` – Other

### Skills
- **Category**: `web` | `api` | `ai` | `mobile`
- **Type**: `technology` (languages/frameworks) | `tool` (platforms/tools)

### Social icon names (FontAwesome)
- `faGithub`, `faLinkedin`, `faInstagram`, `faDiscord`, `faEnvelope`, `faTwitter`, `faYoutube`

## Image hosting

For project images, use any public URL. Recommended options:
- Upload to Supabase Storage (free tier available)
- Use an image hosting service like Cloudinary or ImgBB
- Link to your GitHub repository images

To allow external image domains in Next.js, add them to `next.config.js` under `images.remotePatterns`.
