"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminApi";
import AdminModal from "@/app/admin/components/AdminModal";
import AdminFormInput from "@/app/admin/components/AdminFormInput";
import AdminFormSelect from "@/app/admin/components/AdminFormSelect";
import AdminToast from "@/app/admin/components/AdminToast";
import useAdminToast from "@/app/admin/hooks/useAdminToast";

const CATEGORY_LABELS = {
  web: "Web Development",
  api: "REST API / Backend",
  ai: "AI & Machine Learning",
  mobile: "Mobile Development",
};

const emptyForm = { name: "", category: "web", skillType: "technology" };

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const { toast, showToast } = useAdminToast();

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const response = await adminFetch("/api/skills");
      setSkills(response.data || []);
    } catch (error) {
      showToast("Failed to load skills", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (skill) => {
    setEditing(skill);
    setForm({
      name: skill.name,
      category: skill.category,
      skillType: skill.skill_type ?? skill.skillType ?? "technology",
    });
    setModalOpen(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      if (editing) {
        await adminFetch(`/api/skills/${editing.id}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
        showToast("Skill updated");
      } else {
        await adminFetch("/api/skills", {
          method: "POST",
          body: JSON.stringify(form),
        });
        showToast("Skill created");
      }
      setModalOpen(false);
      fetchSkills();
    } catch (error) {
      showToast("Save failed", "error");
    }
  };

  const handleDelete = async (skillId) => {
    if (!window.confirm("Delete this skill?")) return;
    try {
      await adminFetch(`/api/skills/${skillId}`, { method: "DELETE" });
      showToast("Skill deleted");
      fetchSkills();
    } catch (error) {
      showToast("Delete failed", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Skills</h2>
        <button
          onClick={openCreate}
          className="px-4 py-2 bg-slate-900 text-white rounded-md"
        >
          Add Skill
        </button>
      </div>

      {loading ? (
        <div className="text-slate-500">Loading skills...</div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Category</th>
                <th className="text-left px-4 py-3">Type</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {skills.map((skill) => (
                <tr key={skill.id} className="border-t">
                  <td className="px-4 py-3 font-medium">{skill.name}</td>
                  <td className="px-4 py-3">
                    {CATEGORY_LABELS[skill.category] ?? skill.category}
                  </td>
                  <td className="px-4 py-3 capitalize">
                    {skill.skill_type ?? skill.skillType}
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => openEdit(skill)}
                      className="text-slate-700 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(skill.id)}
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

      <AdminModal
        open={modalOpen}
        title={editing ? "Edit Skill" : "Add Skill"}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <AdminFormInput
            label="Skill Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminFormSelect
              label="Category"
              name="category"
              value={form.category}
              onChange={handleChange}
              options={[
                { value: "web", label: "Web Development" },
                { value: "api", label: "REST API / Backend" },
                { value: "ai", label: "AI & Machine Learning" },
                { value: "mobile", label: "Mobile Development" },
              ]}
            />
            <AdminFormSelect
              label="Type"
              name="skillType"
              value={form.skillType}
              onChange={handleChange}
              options={[
                { value: "technology", label: "Technology / Language" },
                { value: "tool", label: "Tool / Platform" },
              ]}
            />
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
      </AdminModal>

      <AdminToast toast={toast} />
    </div>
  );
}
