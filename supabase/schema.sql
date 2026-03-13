-- ============================================================
-- Vedaang Sharma Portfolio – Supabase Database Schema
-- Run this in your Supabase SQL Editor to set up all tables.
-- ============================================================

-- Enable UUID extension (usually already enabled on Supabase)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─────────────────────────────────────────────
-- PROJECTS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT        NOT NULL,
  slug        TEXT        UNIQUE NOT NULL,
  year        INTEGER,
  description TEXT[]      DEFAULT '{}',
  tech_stack  TEXT[]      DEFAULT '{}',
  github_link TEXT        DEFAULT '',
  live_link   TEXT        DEFAULT '',
  thumbnail   TEXT        DEFAULT '',
  images      TEXT[]      DEFAULT '{}',
  -- category is a text array: 'web' | 'ai' | 'other'
  category    TEXT[]      DEFAULT '{}',
  featured    BOOLEAN     DEFAULT FALSE,
  show        BOOLEAN     DEFAULT TRUE,
  sort_order  INTEGER     DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- SKILLS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS skills (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT        NOT NULL,
  -- category: 'web' | 'api' | 'ai' | 'mobile'
  category   TEXT        NOT NULL DEFAULT 'web',
  -- skill_type: 'technology' | 'tool'
  skill_type TEXT        NOT NULL DEFAULT 'technology',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- EXPERIENCE
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS experience (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  company     TEXT        NOT NULL,
  position    TEXT        NOT NULL,
  start_date  TEXT        NOT NULL,   -- e.g. "Jan 2023"
  end_date    TEXT        NOT NULL,   -- e.g. "Dec 2023" or "Present"
  description TEXT        DEFAULT '',
  type        TEXT        DEFAULT '', -- e.g. "Full-time", "Internship"
  location    TEXT        DEFAULT '',
  skills      TEXT[]      DEFAULT '{}',
  sort_order  INTEGER     DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- EDUCATION
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS education (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  institute   TEXT        NOT NULL,
  degree      TEXT        NOT NULL,
  start_year  TEXT        NOT NULL,
  end_year    TEXT        NOT NULL,
  summary     TEXT        DEFAULT '',
  gpa         TEXT        DEFAULT '',
  images      TEXT[]      DEFAULT '{}',
  -- achievements is a JSONB array:
  -- [{ year, title, subtitle, date, color, iconName }, ...]
  achievements JSONB      DEFAULT '[]',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- SOCIALS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS socials (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  platform   TEXT        NOT NULL,          -- e.g. "GitHub"
  url        TEXT        NOT NULL,          -- e.g. "https://github.com/..." or "mailto:..."
  icon_name  TEXT        NOT NULL DEFAULT '', -- FontAwesome icon name e.g. "faGithub"
  sort_order INTEGER     DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS)
-- All tables are public for reads; writes require the service-role key
-- which bypasses RLS entirely. No extra policies needed.
-- ─────────────────────────────────────────────
ALTER TABLE projects    ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills      ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience  ENABLE ROW LEVEL SECURITY;
ALTER TABLE education   ENABLE ROW LEVEL SECURITY;
ALTER TABLE socials     ENABLE ROW LEVEL SECURITY;

-- Allow anyone to SELECT (public portfolio data)
CREATE POLICY "Public read projects"   ON projects   FOR SELECT USING (true);
CREATE POLICY "Public read skills"     ON skills     FOR SELECT USING (true);
CREATE POLICY "Public read experience" ON experience FOR SELECT USING (true);
CREATE POLICY "Public read education"  ON education  FOR SELECT USING (true);
CREATE POLICY "Public read socials"    ON socials    FOR SELECT USING (true);

-- ─────────────────────────────────────────────
-- ADMIN USER SETUP (via Supabase Auth)
-- ─────────────────────────────────────────────
-- Create your admin user through the Supabase Dashboard:
--   Authentication > Users > Add User
-- Use the email and password you want to log in with.
-- The Next.js /api/auth/login route calls supabase.auth.signInWithPassword()
-- so no extra table is needed.
