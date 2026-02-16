import { useEffect, useState } from "react";
import api from "../lib/api.js";
import Modal from "../components/Modal.jsx";
import FormInput from "../components/FormInput.jsx";
import FormTextarea from "../components/FormTextarea.jsx";
import TagInput from "../components/TagInput.jsx";
import Toast from "../components/Toast.jsx";
import useToast from "../hooks/useToast.js";

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

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const { toast, showToast } = useToast();

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/projects");
      setProjects(response.data.data);
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
        await api.put(`/api/projects/${editing._id}`, payload);
        showToast("Project updated");
      } else {
        await api.post("/api/projects", payload);
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
      await api.delete(`/api/projects/${projectId}`);
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
                  <td className="px-4 py-3">
                    {project.featured ? "Yes" : "No"}
                  </td>
                  <td className="px-4 py-3">{project.show ? "Yes" : "No"}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => openEdit(project)}
                      className="text-slate-700 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={modalOpen}
        title={editing ? "Edit Project" : "Add Project"}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
            <FormInput
              label="Slug"
              name="slug"
              value={form.slug}
              onChange={handleChange}
              required
            />
            <FormInput
              label="Year"
              name="year"
              value={form.year}
              onChange={handleChange}
            />
            <FormInput
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
          <FormTextarea
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
          <TagInput
            label="Tech Stack"
            values={form.techStack}
            onChange={(values) => setForm((prev) => ({ ...prev, techStack: values }))}
            placeholder="Add tech"
          />
          <TagInput
            label="Images"
            values={form.images}
            onChange={(values) => setForm((prev) => ({ ...prev, images: values }))}
            placeholder="Add image URL"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="GitHub Link"
              name="githubLink"
              value={form.githubLink}
              onChange={handleChange}
            />
            <FormInput
              label="Live Link"
              name="liveLink"
              value={form.liveLink}
              onChange={handleChange}
            />
            <FormInput
              label="Thumbnail Image URL"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={handleChange}
              />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="show"
                checked={form.show}
                onChange={handleChange}
              />
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
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-slate-900 text-white"
            >
              Save
            </button>
          </div>
        </form>
      </Modal>
      <Toast toast={toast} />
    </div>
  );
};

export default Projects;
