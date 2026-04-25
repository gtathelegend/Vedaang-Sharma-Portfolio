"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminApi";
import AdminModal from "@/app/admin/components/AdminModal";
import AdminFormInput from "@/app/admin/components/AdminFormInput";
import AdminFormTextarea from "@/app/admin/components/AdminFormTextarea";
import AdminTagInput from "@/app/admin/components/AdminTagInput";
import AdminImageUpload from "@/app/admin/components/AdminImageUpload";
import AdminToast from "@/app/admin/components/AdminToast";
import useAdminToast from "@/app/admin/hooks/useAdminToast";

const emptyForm = {
  title: "",
  slug: "",
  year: "",
  description: [],
  techStack: [],
  githubLink: "",
  liveLink: "",
  imageUrl: "",
  images: [],
  category: [],
  featured: false,
  show: true,
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const { toast, showToast } = useAdminToast();

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await adminFetch("/api/projects");
      setProjects(response.data || []);
    } catch (error) {
      showToast("Failed to load projects", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (project) => {
    setEditing(project);
    setForm({
      title: project.title || "",
      slug: project.slug || "",
      year: project.year || "",
      description: project.description || project.desc || [],
      techStack: project.techStack || project.tech || [],
      githubLink: project.githubLink || project.code || "",
      liveLink: project.liveLink || project.preview || "",
      imageUrl: project.imageUrl || project.thumbnail || "",
      images: project.images || [],
      category: project.category || [],
      featured: project.featured || false,
      show: project.show ?? true,
    });
    setModalOpen(true);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        ...form,
        category: form.category.map((value) => Number(value)),
      };

      if (editing) {
        await adminFetch(`/api/projects/${editing._id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        showToast("Project updated");
      } else {
        await adminFetch("/api/projects", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        showToast("Project created");
      }

      setModalOpen(false);
      fetchProjects();
    } catch (error) {
      showToast("Save failed", "error");
    }
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await adminFetch(`/api/projects/${projectId}`, { method: "DELETE" });
      showToast("Project deleted");
      fetchProjects();
    } catch (error) {
      showToast("Delete failed", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Projects</h2>
        <button
          onClick={openCreate}
          className="px-4 py-2 bg-slate-900 text-white rounded-md"
        >
          Add Project
        </button>
      </div>

      {loading ? (
        <div className="text-slate-500">Loading projects...</div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="text-left px-4 py-3">Title</th>
                <th className="text-left px-4 py-3">Year</th>
                <th className="text-left px-4 py-3">Featured</th>
                <th className="text-left px-4 py-3">Visible</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project._id} className="border-t">
                  <td className="px-4 py-3 font-medium">{project.title}</td>
                  <td className="px-4 py-3">{project.year}</td>
                  <td className="px-4 py-3">{project.featured ? "Yes" : "No"}</td>
                  <td className="px-4 py-3">{project.show ? "Yes" : "No"}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button onClick={() => openEdit(project)} className="text-slate-700 hover:underline">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(project._id)} className="text-red-600 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AdminModal
        open={modalOpen}
        title={editing ? "Edit Project" : "Add Project"}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminFormInput label="Title" name="title" value={form.title} onChange={handleChange} required />
            <AdminFormInput label="Slug" name="slug" value={form.slug} onChange={handleChange} required />
            <AdminFormInput label="Year" name="year" value={form.year} onChange={handleChange} />
            <AdminFormInput
              label="Category IDs (comma separated)"
              name="category"
              value={form.category.join(",")}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  category: event.target.value
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean),
                }))
              }
            />
          </div>

          <AdminFormTextarea
            label="Description (one paragraph per line)"
            value={form.description.join("\n")}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                description: event.target.value
                  .split("\n")
                  .map((item) => item.trim())
                  .filter(Boolean),
              }))
            }
          />

          <AdminTagInput
            label="Tech Stack"
            values={form.techStack}
            onChange={(values) => setForm((prev) => ({ ...prev, techStack: values }))}
            placeholder="Add tech"
          />

          <div className="space-y-2 p-4 border border-slate-200 rounded-md">
            <AdminTagInput
              label="Images (URLs)"
              values={form.images}
              onChange={(values) => setForm((prev) => ({ ...prev, images: values }))}
              placeholder="Add image URL"
            />
            <AdminImageUpload 
              label="Or upload a gallery image" 
              onUpload={(url) => setForm(prev => ({ ...prev, images: [...prev.images, url] }))} 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminFormInput label="GitHub Link" name="githubLink" value={form.githubLink} onChange={handleChange} />
            <AdminFormInput label="Live Link" name="liveLink" value={form.liveLink} onChange={handleChange} />
            
            <div className="space-y-2 p-4 border border-slate-200 rounded-md">
              <AdminFormInput
                label="Thumbnail Image URL"
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
              />
              <AdminImageUpload 
                label="Or upload a thumbnail" 
                onUpload={(url) => setForm(prev => ({ ...prev, imageUrl: url }))} 
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="show" checked={form.show} onChange={handleChange} />
              Visible on site
            </label>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-md border border-slate-300"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded-md bg-slate-900 text-white">
              Save
            </button>
          </div>
        </form>
      </AdminModal>

      <AdminToast toast={toast} />
    </div>
  );
}
