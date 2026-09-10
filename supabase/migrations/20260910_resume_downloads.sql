-- ============================================================
-- Resume Download Tracking Table & Indexes
-- ============================================================

CREATE TABLE IF NOT EXISTS public.resume_downloads (
  id                  UUID                     DEFAULT gen_random_uuid() PRIMARY KEY,
  resume_name         TEXT                     NOT NULL DEFAULT 'Vedaang_Sharma_Resume.pdf',
  downloaded_at       TIMESTAMPTZ              NOT NULL DEFAULT now(),
  ip_address          TEXT,
  user_agent          TEXT,
  referrer            TEXT,
  request_path        TEXT,
  country             TEXT,
  country_code        TEXT,
  region              TEXT,
  region_name         TEXT,
  city                TEXT,
  zip                 TEXT,
  latitude            NUMERIC(10, 6),
  longitude           NUMERIC(10, 6),
  timezone            TEXT,
  isp                 TEXT,
  organization        TEXT,
  asn                 TEXT,
  as_name             TEXT,
  geolocation_status  TEXT                     DEFAULT 'unknown',
  email_status        TEXT                     DEFAULT 'pending',
  created_at          TIMESTAMPTZ              NOT NULL DEFAULT now()
);

-- Indices for future analytical queries
CREATE INDEX IF NOT EXISTS idx_resume_downloads_downloaded_at ON public.resume_downloads(downloaded_at DESC);
CREATE INDEX IF NOT EXISTS idx_resume_downloads_ip_address ON public.resume_downloads(ip_address);
CREATE INDEX IF NOT EXISTS idx_resume_downloads_country_code ON public.resume_downloads(country_code);

-- Enable Row Level Security (RLS)
ALTER TABLE public.resume_downloads ENABLE ROW LEVEL SECURITY;

-- Deny public anon access (RLS default when enabled without public policies).
-- Only service_role (used by createAdminClient() on server) has full read/write access.

-- Optional: Allow authenticated admin users to view resume downloads
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'resume_downloads' 
      AND policyname = 'Admin users can read resume downloads'
  ) THEN
    CREATE POLICY "Admin users can read resume downloads"
      ON public.resume_downloads
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;
