"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminApi";
import AdminFormInput from "@/app/admin/components/AdminFormInput";
import AdminFormTextarea from "@/app/admin/components/AdminFormTextarea";
import AdminImageUpload from "@/app/admin/components/AdminImageUpload";
import AdminToast from "@/app/admin/components/AdminToast";
import useAdminToast from "@/app/admin/hooks/useAdminToast";

const emptyForm = {
  full_name: "",
  tagline: "",
  hero_subtitle: "",
  hero_image: "",
  about_image: "",
  cv_url: "",
  email: "",
  resume_pdf_url: "",
  meta_title: "",
  meta_description: "",
  og_image: "",
  spotify_enabled: true,
  about_bio: "",
  quote_text: "",
};

const emptyNow = {
  focus: "",
  learning: "",
  reading: "",
  listening: "",
  location: "",
};

export default function AdminSettingsPage() {
  const [form, setForm] = useState(emptyForm);
  const [now, setNow] = useState(emptyNow);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingNow, setSavingNow] = useState(false);
  const { toast, showToast } = useAdminToast();

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const [settingsRes, nowRes] = await Promise.all([
          adminFetch("/api/settings"),
          adminFetch("/api/now").catch(() => ({ data: {} })),
        ]);
        if (settingsRes.data && Object.keys(settingsRes.data).length > 0) {
          setForm({ ...emptyForm, ...settingsRes.data });
        }
        if (nowRes?.data) {
          setNow({ ...emptyNow, ...nowRes.data });
        }
      } catch {
        showToast("Failed to load settings", "error");
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleNowChange = (e) => {
    const { name, value } = e.target;
    setNow((prev) => ({ ...prev, [name]: value }));
  };

  const handleNowSave = async (e) => {
    e.preventDefault();
    setSavingNow(true);
    try {
      await adminFetch("/api/now", {
        method: "PUT",
        body: JSON.stringify(now),
      });
      showToast("/now updated");
    } catch {
      showToast("Could not save /now (does site_settings have a 'now' jsonb column?)", "error");
    } finally {
      setSavingNow(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminFetch("/api/settings", {
        method: "PUT",
        body: JSON.stringify(form),
      });
      showToast("Settings saved");
    } catch {
      showToast("Save failed", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-slate-500">Loading settings...</div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <h2 className="text-2xl font-semibold">Site Settings</h2>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Identity */}
        <section className="bg-white rounded-xl shadow p-6 space-y-4">
          <h3 className="text-base font-semibold text-slate-700 border-b pb-2">Identity</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminFormInput label="Full Name" name="full_name" value={form.full_name} onChange={handleChange} />
            <AdminFormInput label="Tagline (e.g. Full Stack Developer)" name="tagline" value={form.tagline} onChange={handleChange} />
            <AdminFormInput label="Email" name="email" value={form.email} onChange={handleChange} type="email" />
          </div>
          <AdminFormTextarea label="Hero Subtitle / Bio" name="hero_subtitle" value={form.hero_subtitle} onChange={handleChange} />
        </section>

        {/* About Bio */}
        <section className="bg-white rounded-xl shadow p-6 space-y-4">
          <h3 className="text-base font-semibold text-slate-700 border-b pb-2">About Bio</h3>
          <p className="text-xs text-slate-500">
            Write your bio as plain text. Separate paragraphs with a blank line (two newlines). Shown on the About page.
          </p>
          <AdminFormTextarea
            label="Bio Text"
            name="about_bio"
            value={form.about_bio}
            onChange={handleChange}
            rows={8}
          />
          <AdminFormTextarea
            label="Quote (shown at the bottom of the About page)"
            name="quote_text"
            value={form.quote_text}
            onChange={handleChange}
            rows={2}
          />
        </section>

        {/* Images */}
        <section className="bg-white rounded-xl shadow p-6 space-y-4">
          <h3 className="text-base font-semibold text-slate-700 border-b pb-2">Images</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <AdminFormInput label="Hero Image URL" name="hero_image" value={form.hero_image} onChange={handleChange} />
              <AdminImageUpload label="Or upload hero image" onUpload={(url) => setForm(p => ({ ...p, hero_image: url }))} />
              {form.hero_image && <img src={form.hero_image} alt="Hero preview" className="h-24 rounded-md object-cover" />}
            </div>
            <div className="space-y-2">
              <AdminFormInput label="About Image URL" name="about_image" value={form.about_image} onChange={handleChange} />
              <AdminImageUpload label="Or upload about image" onUpload={(url) => setForm(p => ({ ...p, about_image: url }))} />
              {form.about_image && <img src={form.about_image} alt="About preview" className="h-24 rounded-md object-cover" />}
            </div>
            <div className="space-y-2">
              <AdminFormInput label="OG Image URL" name="og_image" value={form.og_image} onChange={handleChange} />
              <AdminImageUpload label="Or upload OG image" onUpload={(url) => setForm(p => ({ ...p, og_image: url }))} />
            </div>
          </div>
        </section>

        {/* CV / Resume */}
        <section className="bg-white rounded-xl shadow p-6 space-y-4">
          <h3 className="text-base font-semibold text-slate-700 border-b pb-2">CV / Resume</h3>
          <p className="text-xs text-slate-500">Upload a PDF — it will be available via the Download CV button on the homepage.</p>

          <AdminImageUpload
            label="Upload new resume (PDF)"
            accept="application/pdf,.pdf"
            successMessage="Resume uploaded — click Save Settings to apply."
            onUpload={(url) => setForm(p => ({ ...p, cv_url: url, resume_pdf_url: url }))}
          />

          {form.cv_url && (
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <svg className="w-8 h-8 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-700 truncate">Current resume</p>
                <p className="text-xs text-slate-400 truncate">{form.cv_url}</p>
              </div>
              <a href={form.cv_url} target="_blank" rel="noreferrer" className="shrink-0 text-xs font-medium text-slate-600 hover:text-slate-900 underline">
                Preview ↗
              </a>
            </div>
          )}

          <div className="pt-1">
            <AdminFormInput label="Or paste a direct URL" name="cv_url" value={form.cv_url} onChange={handleChange} />
          </div>
        </section>

        {/* SEO */}
        <section className="bg-white rounded-xl shadow p-6 space-y-4">
          <h3 className="text-base font-semibold text-slate-700 border-b pb-2">SEO</h3>
          <AdminFormInput label="Meta Title" name="meta_title" value={form.meta_title} onChange={handleChange} />
          <AdminFormTextarea label="Meta Description" name="meta_description" value={form.meta_description} onChange={handleChange} />
        </section>

        {/* Feature Flags */}
        <section className="bg-white rounded-xl shadow p-6 space-y-3">
          <h3 className="text-base font-semibold text-slate-700 border-b pb-2">Feature Flags</h3>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="spotify_enabled" checked={!!form.spotify_enabled} onChange={handleChange} />
            Show Spotify widget
          </label>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>

      {/* /now editor (separate save - writes to a `now` jsonb column on site_settings) */}
      <form onSubmit={handleNowSave} className="space-y-4">
        <section className="bg-white rounded-xl shadow p-6 space-y-4">
          <div className="flex items-baseline justify-between border-b pb-2">
            <h3 className="text-base font-semibold text-slate-700">/now page</h3>
            <span className="text-xs text-slate-400">Public at /now</span>
          </div>
          <p className="text-xs text-slate-500 -mt-2">
            Schema note: requires a <code>now jsonb</code> column on <code>site_settings</code>. Empty
            fields fall back to defaults on the public page.
          </p>
          <AdminFormTextarea
            label="Focus - what you're working on"
            name="focus"
            value={now.focus}
            onChange={handleNowChange}
            rows={2}
          />
          <AdminFormTextarea
            label="Learning"
            name="learning"
            value={now.learning}
            onChange={handleNowChange}
            rows={2}
          />
          <AdminFormTextarea
            label="Reading"
            name="reading"
            value={now.reading}
            onChange={handleNowChange}
            rows={2}
          />
          <AdminFormTextarea
            label="Listening"
            name="listening"
            value={now.listening}
            onChange={handleNowChange}
            rows={2}
          />
          <AdminFormInput
            label="Based in"
            name="location"
            value={now.location}
            onChange={handleNowChange}
          />
        </section>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={savingNow}
            className="px-6 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition disabled:opacity-50"
          >
            {savingNow ? "Saving..." : "Save /now"}
          </button>
        </div>
      </form>

      <AdminToast toast={toast} />
    </div>
  );
}
