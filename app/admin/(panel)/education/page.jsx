"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminApi";
import AdminModal from "@/app/admin/components/AdminModal";
import AdminFormInput from "@/app/admin/components/AdminFormInput";
import AdminFormTextarea from "@/app/admin/components/AdminFormTextarea";
import AdminTagInput from "@/app/admin/components/AdminTagInput";
import AdminToast from "@/app/admin/components/AdminToast";
import useAdminToast from "@/app/admin/hooks/useAdminToast";

const emptyAchievement = {
  year: "",
  title: "",
  subtitle: "",
  date: "",
  color: "from-gray-400 to-gray-600",
  iconName: "faAward",
};

const emptyForm = {
  institute: "",
  degree: "",
  startYear: "",
  endYear: "",
  summary: "",
  gpa: "",
  images: [],
  achievements: [],
};

export default function AdminEducationPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const { toast, showToast } = useAdminToast();

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await adminFetch("/api/education");
      setItems(response.data || []);
    } catch (error) {
      showToast("Failed to load education", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      institute: item.institute ?? "",
      degree: item.degree ?? "",
      startYear: item.startYear ?? item.start_year ?? "",
      endYear: item.endYear ?? item.end_year ?? "",
      summary: item.summary ?? "",
      gpa: item.gpa ?? "",
      images: item.images ?? [],
      achievements: item.achievements ?? [],
    });
    setModalOpen(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const updateAchievement = (index, field, value) => {
    setForm((prev) => {
      const updated = [...prev.achievements];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, achievements: updated };
    });
  };

  const addAchievement = () => {
    setForm((prev) => ({
      ...prev,
      achievements: [...prev.achievements, emptyAchievement],
    }));
  };

  const removeAchievement = (index) => {
    setForm((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((_, idx) => idx !== index),
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        ...form,
        achievements: form.achievements.map((item) => ({
          ...item,
          year: Number(item.year),
        })),
      };

      if (editing) {
        await adminFetch(`/api/education/${editing.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        showToast("Education updated");
      } else {
        await adminFetch("/api/education", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        showToast("Education created");
      }

      setModalOpen(false);
      fetchItems();
    } catch (error) {
      showToast("Save failed", "error");
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm("Delete this entry?")) return;
    try {
      await adminFetch(`/api/education/${itemId}`, { method: "DELETE" });
      showToast("Education deleted");
      fetchItems();
    } catch (error) {
      showToast("Delete failed", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Education</h2>
        <button
          onClick={openCreate}
          className="px-4 py-2 bg-slate-900 text-white rounded-md"
        >
          Add Education
        </button>
      </div>

      {loading ? (
        <div className="text-slate-500">Loading education...</div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="text-left px-4 py-3">Institute</th>
                <th className="text-left px-4 py-3">Degree</th>
                <th className="text-left px-4 py-3">Years</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-3 font-medium">{item.institute}</td>
                  <td className="px-4 py-3">{item.degree}</td>
                  <td className="px-4 py-3">
                    {item.startYear ?? item.start_year} –{" "}
                    {item.endYear ?? item.end_year}
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => openEdit(item)}
                      className="text-slate-700 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
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
        title={editing ? "Edit Education" : "Add Education"}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminFormInput
              label="Institute / University"
              name="institute"
              value={form.institute}
              onChange={handleChange}
              required
            />
            <AdminFormInput
              label="Degree / Programme"
              name="degree"
              value={form.degree}
              onChange={handleChange}
              required
            />
            <AdminFormInput
              label="Start Year"
              name="startYear"
              value={form.startYear}
              onChange={handleChange}
              required
            />
            <AdminFormInput
              label="End Year (or Expected)"
              name="endYear"
              value={form.endYear}
              onChange={handleChange}
              required
            />
            <AdminFormInput
              label="GPA / CGPA"
              name="gpa"
              value={form.gpa}
              onChange={handleChange}
            />
          </div>

          <AdminFormTextarea
            label="Summary"
            name="summary"
            value={form.summary}
            onChange={handleChange}
          />

          <AdminTagInput
            label="Images (URLs)"
            values={form.images}
            onChange={(values) =>
              setForm((prev) => ({ ...prev, images: values }))
            }
            placeholder="Add image URL"
          />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Achievements</h3>
              <button
                type="button"
                onClick={addAchievement}
                className="px-3 py-2 bg-slate-900 text-white rounded-md text-sm"
              >
                Add Achievement
              </button>
            </div>

            {form.achievements.map((achievement, index) => (
              <div
                key={`${achievement.title || "item"}-${index}`}
                className="border border-slate-200 rounded-lg p-4 space-y-3"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AdminFormInput
                    label="Year"
                    value={achievement.year}
                    onChange={(e) =>
                      updateAchievement(index, "year", e.target.value)
                    }
                  />
                  <AdminFormInput
                    label="Date (e.g. March 2024)"
                    value={achievement.date}
                    onChange={(e) =>
                      updateAchievement(index, "date", e.target.value)
                    }
                  />
                  <AdminFormInput
                    label="Title"
                    value={achievement.title}
                    onChange={(e) =>
                      updateAchievement(index, "title", e.target.value)
                    }
                  />
                  <AdminFormInput
                    label="Subtitle / Organiser"
                    value={achievement.subtitle}
                    onChange={(e) =>
                      updateAchievement(index, "subtitle", e.target.value)
                    }
                  />
                  <AdminFormInput
                    label="Gradient (e.g. from-blue-400 to-blue-600)"
                    value={achievement.color}
                    onChange={(e) =>
                      updateAchievement(index, "color", e.target.value)
                    }
                  />
                  <AdminFormInput
                    label="Icon (faAward, faMedal, faTrophy, faGraduationCap)"
                    value={achievement.iconName}
                    onChange={(e) =>
                      updateAchievement(index, "iconName", e.target.value)
                    }
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeAchievement(index)}
                  className="text-red-600 text-sm"
                >
                  Remove achievement
                </button>
              </div>
            ))}
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
