import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import api from "../lib/api.js";
import Modal from "../components/Modal.jsx";
import FormInput from "../components/FormInput.jsx";
import TagInput from "../components/TagInput.jsx";
import CategoryMultiSelect from "../components/CategoryMultiSelect.jsx";
import Toast from "../components/Toast.jsx";
import useToast from "../hooks/useToast.js";
import useDebouncedValue from "../hooks/useDebouncedValue.js";
import useCategories from "../hooks/useCategories.js";
import slugify from "../utils/slugify.js";

const MDEditor = lazy(() => import("@uiw/react-md-editor"));
const CloudinaryUploader = lazy(() => import("../components/CloudinaryUploader.jsx"));

const emptyForm = {
  title: "",
  slug: "",
  year: new Date().getFullYear(),
  descriptionMarkdown: "",
  techStack: [],
  githubLink: "",
  liveLink: "",
  thumbnail: "",
  images: [],
  categories: [],
  featured: false,
  visible: true,
  status: "draft",
  order: 0,
  seo: {
    metaTitle: "",
    metaDescription: "",
  },
};

const SortableProjectRow = ({ project, onEdit, onDelete, onQuickStatus }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: project._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr ref={setNodeRef} style={style} className="border-t bg-white">
      <td className="px-4 py-3 text-slate-400 cursor-grab" {...attributes} {...listeners}>
        ☰
      </td>
      <td className="px-4 py-3 font-medium flex items-center gap-2">
        <span>{project.title}</span>
        {project.featured && (
          <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700">
            Featured
          </span>
        )}
      </td>
      <td className="px-4 py-3">{project.year}</td>
      <td className="px-4 py-3 capitalize">{project.status}</td>
      <td className="px-4 py-3">{project.visible ? "Yes" : "No"}</td>
      <td className="px-4 py-3 text-right space-x-2">
        <button
          onClick={() => onQuickStatus(project)}
          className="text-sky-700 hover:underline"
          type="button"
        >
          {project.status === "published" ? "Mark Draft" : "Publish"}
        </button>
        <button
          onClick={() => onEdit(project)}
          className="text-slate-700 hover:underline"
          type="button"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(project._id)}
          className="text-red-600 hover:underline"
          type="button"
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [manualSlug, setManualSlug] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [newCategoryName, setNewCategoryName] = useState("");
  const { toast, showToast } = useToast();
  const { categories, loading: categoryLoading, createCategory } = useCategories();

  const sensors = useSensors(useSensor(PointerSensor));
  const debouncedTitle = useDebouncedValue(form.title, 300);

  useEffect(() => {
    if (!manualSlug) {
      setForm((prev) => ({ ...prev, slug: slugify(debouncedTitle) }));
    }
  }, [debouncedTitle, manualSlug]);

  const fetchProjects = async (page = 1, status = statusFilter) => {
    setLoading(true);
    try {
      const query = new URLSearchParams({ page: String(page), limit: "50" });
      if (status) {
        query.set("status", status);
      }

      const response = await api.get(`/api/projects?${query.toString()}`);
      setProjects(response.data.data.items || []);
      setPagination(response.data.data.pagination || { page: 1, totalPages: 1 });
    } catch (error) {
      showToast("Failed to load projects", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects(1, statusFilter);
  }, [statusFilter]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setManualSlug(false);
    setModalOpen(true);
  };

  const openEdit = (project) => {
    setEditing(project);
    setForm({
      title: project.title || "",
      slug: project.slug || "",
      year: project.year || "",
      descriptionMarkdown: (project.description || project.desc || []).join("\n\n"),
      techStack: project.techStack || project.tech || [],
      githubLink: project.githubLink || project.code || "",
      liveLink: project.liveLink || project.preview || "",
      thumbnail: project.thumbnail || "",
      images: project.images || [],
      categories: (project.categories || []).map((item) => item?._id || item),
      featured: project.featured || false,
      visible: project.visible ?? project.show ?? true,
      status: project.status || "draft",
      order: project.order || 0,
      seo: {
        metaTitle: project?.seo?.metaTitle || "",
        metaDescription: project?.seo?.metaDescription || "",
      },
    });
    setManualSlug(true);
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
    setSaving(true);

    try {
      const payload = {
        ...form,
        year: Number(form.year),
        categories: form.categories,
        description: form.descriptionMarkdown
          .split(/\n{2,}/)
          .map((item) => item.trim())
          .filter(Boolean),
      };

      delete payload.descriptionMarkdown;

      if (editing) {
        const response = await api.put(`/api/projects/${editing._id}`, payload);
        const saved = response?.data?.data;
        setProjects((prev) => prev.map((item) => (item._id === editing._id ? saved : item)));
        showToast("Project updated");
      } else {
        const tempId = `temp-${Date.now()}`;
        const optimisticItem = {
          ...payload,
          _id: tempId,
          status: payload.status,
          visible: payload.visible,
          featured: payload.featured,
        };

        setProjects((prev) => [optimisticItem, ...prev]);

        try {
          const response = await api.post("/api/projects", payload);
          const saved = response?.data?.data;
          setProjects((prev) => prev.map((item) => (item._id === tempId ? saved : item)));
        } catch (error) {
          setProjects((prev) => prev.filter((item) => item._id !== tempId));
          throw error;
        }

        showToast("Project created");
      }

      setModalOpen(false);
    } catch (error) {
      showToast(error?.response?.data?.error?.message || "Save failed", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await api.delete(`/api/projects/${projectId}`);
      showToast("Project deleted");
      setProjects((prev) => prev.filter((item) => item._id !== projectId));
    } catch (error) {
      showToast("Delete failed", "error");
    }
  };

  const handleQuickStatusToggle = async (project) => {
    const nextStatus = project.status === "published" ? "draft" : "published";
    try {
      const response = await api.put(`/api/projects/${project._id}`, { status: nextStatus });
      const updated = response?.data?.data;
      setProjects((prev) => prev.map((item) => (item._id === project._id ? updated : item)));
      showToast(`Project set to ${nextStatus}`);
    } catch (error) {
      showToast("Failed to update status", "error");
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = projects.findIndex((item) => item._id === active.id);
    const newIndex = projects.findIndex((item) => item._id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const reordered = arrayMove(projects, oldIndex, newIndex);
    setProjects(reordered);

    try {
      setReordering(true);
      const orderedIds = reordered
        .map((item) => item._id)
        .filter((id) => typeof id === "string" && !id.startsWith("temp-"));

      await api.patch("/api/projects/reorder", { orderedIds });
      showToast("Order updated");
    } catch (error) {
      showToast("Failed to update order", "error");
      fetchProjects(pagination.page, statusFilter);
    } finally {
      setReordering(false);
    }
  };

  const selectedCategoryNames = useMemo(
    () =>
      categories
        .filter((category) => form.categories.some((id) => String(id) === String(category._id)))
        .map((category) => category.name),
    [categories, form.categories]
  );

  const handleCreateCategoryInline = async () => {
    const name = newCategoryName.trim();
    if (!name) return;

    try {
      const created = await createCategory(name);
      setForm((prev) => ({
        ...prev,
        categories: [...new Set([...prev.categories, created._id])],
      }));
      setNewCategoryName("");
      showToast("Category created");
    } catch (error) {
      showToast(error?.response?.data?.error?.message || "Failed to create category", "error");
    }
  };

  const tableIds = projects.map((project) => project._id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Projects</h2>
        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-md bg-white"
          >
            <option value="">All statuses</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
          <button
            onClick={openCreate}
            className="px-4 py-2 bg-slate-900 text-white rounded-md"
            type="button"
          >
            Add Project
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-slate-500">Loading projects...</div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-slate-600">
                <tr>
                  <th className="text-left px-4 py-3 w-12">Order</th>
                  <th className="text-left px-4 py-3">Title</th>
                  <th className="text-left px-4 py-3">Year</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Visible</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                <SortableContext items={tableIds} strategy={verticalListSortingStrategy}>
                  {projects.map((project) => (
                    <SortableProjectRow
                      key={project._id}
                      project={project}
                      onEdit={openEdit}
                      onDelete={handleDelete}
                      onQuickStatus={handleQuickStatusToggle}
                    />
                  ))}
                </SortableContext>
              </tbody>
            </table>
          </DndContext>

          <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-sm text-slate-600">
            <span>
              Page {pagination.page} of {pagination.totalPages}
              {reordering ? " • Saving order..." : ""}
            </span>
            <div className="space-x-2">
              <button
                type="button"
                className="px-3 py-1 border rounded disabled:opacity-50"
                disabled={pagination.page <= 1}
                onClick={() => fetchProjects(pagination.page - 1, statusFilter)}
              >
                Previous
              </button>
              <button
                type="button"
                className="px-3 py-1 border rounded disabled:opacity-50"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => fetchProjects(pagination.page + 1, statusFilter)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      <Modal
        open={modalOpen}
        title={editing ? "Edit Project" : "Add Project"}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <section className="rounded-lg border border-slate-200 p-4 space-y-4">
            <h3 className="text-base font-semibold">Basic Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                onChange={(event) => {
                  setManualSlug(true);
                  handleChange(event);
                }}
                required
              />
              <FormInput
                label="Year"
                name="year"
                type="number"
                value={form.year}
                onChange={handleChange}
                required
              />
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 p-4 space-y-4">
            <h3 className="text-base font-semibold">Content</h3>
            <div data-color-mode="light">
              <Suspense fallback={<div className="text-sm text-slate-500">Loading markdown editor...</div>}>
                <MDEditor
                  value={form.descriptionMarkdown}
                  onChange={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      descriptionMarkdown: value || "",
                    }))
                  }
                  height={260}
                />
              </Suspense>
            </div>
            <TagInput
              label="Tech Stack"
              values={form.techStack}
              onChange={(values) => setForm((prev) => ({ ...prev, techStack: values }))}
              placeholder="Add tech"
            />
          </section>

          <section className="rounded-lg border border-slate-200 p-4 space-y-4">
            <h3 className="text-base font-semibold">Categories</h3>
            {categoryLoading ? (
              <p className="text-sm text-slate-500">Loading categories...</p>
            ) : (
              <CategoryMultiSelect
                categories={categories}
                selected={form.categories}
                onChange={(values) => setForm((prev) => ({ ...prev, categories: values }))}
              />
            )}
            <div className="flex items-center gap-2">
              <input
                value={newCategoryName}
                onChange={(event) => setNewCategoryName(event.target.value)}
                placeholder="Create category inline"
                className="w-full rounded-md border border-slate-300 px-3 py-2"
              />
              <button
                type="button"
                onClick={handleCreateCategoryInline}
                className="px-3 py-2 rounded-md bg-slate-900 text-white"
              >
                Add
              </button>
            </div>
            {!!selectedCategoryNames.length && (
              <p className="text-xs text-slate-500">Selected: {selectedCategoryNames.join(", ")}</p>
            )}
          </section>

          <section className="rounded-lg border border-slate-200 p-4 space-y-4">
            <h3 className="text-base font-semibold">Media</h3>
            <Suspense fallback={<div className="text-sm text-slate-500">Loading uploader...</div>}>
              <CloudinaryUploader
                value={form.images}
                onChange={(values) =>
                  setForm((prev) => ({
                    ...prev,
                    images: values,
                    thumbnail: values[0] || "",
                  }))
                }
              />
            </Suspense>
            <FormInput
              label="Thumbnail URL"
              name="thumbnail"
              value={form.thumbnail}
              onChange={handleChange}
            />
          </section>

          <section className="rounded-lg border border-slate-200 p-4 space-y-4">
            <h3 className="text-base font-semibold">Links</h3>
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
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 p-4 space-y-4">
            <h3 className="text-base font-semibold">Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  name="visible"
                  checked={form.visible}
                  onChange={handleChange}
                />
                Visible on site
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.status === "published"}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      status: event.target.checked ? "published" : "draft",
                    }))
                  }
                />
                Publish now
              </label>
              <div className="md:col-span-2">
                <label className="flex flex-col gap-2 text-sm">
                  <span className="font-medium">Status</span>
                  <select
                    value={form.status}
                    onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
                    className="w-full rounded-md border border-slate-300 px-3 py-2"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </label>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 p-4 space-y-4">
            <h3 className="text-base font-semibold">SEO</h3>
            <div className="grid grid-cols-1 gap-4">
              <FormInput
                label="Meta Title"
                name="metaTitle"
                value={form.seo.metaTitle}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    seo: {
                      ...prev.seo,
                      metaTitle: event.target.value,
                    },
                  }))
                }
              />
              <label className="flex flex-col gap-2 text-sm text-slate-700">
                <span className="font-medium">Meta Description</span>
                <textarea
                  value={form.seo.metaDescription}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      seo: {
                        ...prev.seo,
                        metaDescription: event.target.value,
                      },
                    }))
                  }
                  rows={3}
                  className="rounded-md border border-slate-300 px-3 py-2"
                />
              </label>
            </div>
          </section>

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
              disabled={saving}
              className="px-4 py-2 rounded-md bg-slate-900 text-white disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </Modal>
      <Toast toast={toast} />
    </div>
  );
};

export default Projects;
