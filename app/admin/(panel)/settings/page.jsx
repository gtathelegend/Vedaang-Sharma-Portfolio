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
};

export default function AdminSettingsPage() {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast, showToast } = useAdminToast();

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await adminFetch("/api/settings");
        if (res.data && Object.keys(res.data).length > 0) {
          setForm({ ...emptyForm, ...res.data });
        }
      } catch {
        showToast("Failed to load settings", "error");
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

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
          <AdminFormInput label="CV / Resume URL" name="cv_url" value={form.cv_url} onChange={handleChange} />
          <AdminImageUpload
            label="Or upload CV (PDF)"
            onUpload={(url) => setForm(p => ({ ...p, cv_url: url, resume_pdf_url: url }))}
          />
          {form.cv_url && (
            <a href={form.cv_url} target="_blank" rel="noreferrer" className="text-sm text-slate-500 hover:text-slate-800 underline">
              View current CV ↗
            </a>
          )}
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

      <AdminToast toast={toast} />
    </div>
  );
}
