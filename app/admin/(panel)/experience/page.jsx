"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminApi";
import AdminModal from "@/app/admin/components/AdminModal";
import AdminFormInput from "@/app/admin/components/AdminFormInput";
import AdminFormTextarea from "@/app/admin/components/AdminFormTextarea";
import AdminTagInput from "@/app/admin/components/AdminTagInput";
import AdminToast from "@/app/admin/components/AdminToast";
import useAdminToast from "@/app/admin/hooks/useAdminToast";

const emptyForm = {
  company: "",
  position: "",
  startDate: "",
  endDate: "",
  description: "",
  type: "",
  location: "",
  skills: [],
  sortOrder: 0,
};

export default function AdminExperiencePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const { toast, showToast } = useAdminToast();

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await adminFetch("/api/experience");
      setItems(response.data || []);
    } catch (error) {
      showToast("Failed to load experience", "error");
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
      company: item.company ?? "",
      position: item.position ?? "",
      startDate: item.startDate ?? item.start_date ?? "",
      endDate: item.endDate ?? item.end_date ?? "",
      description: item.description ?? "",
      type: item.type ?? "",
      location: item.location ?? "",
      skills: item.skills ?? [],
      sortOrder: item.sortOrder ?? item.sort_order ?? 0,
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
        await adminFetch(`/api/experience/${editing.id}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
        showToast("Experience updated");
      } else {
        await adminFetch("/api/experience", {
          method: "POST",
          body: JSON.stringify(form),
        });
        showToast("Experience created");
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
      await adminFetch(`/api/experience/${itemId}`, { method: "DELETE" });
      showToast("Experience deleted");
      fetchItems();
    } catch (error) {
      showToast("Delete failed", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Experience</h2>
        <button
          onClick={openCreate}
          className="px-4 py-2 bg-slate-900 text-white rounded-md"
        >
          Add Experience
        </button>
      </div>

      {loading ? (
        <div className="text-slate-500">Loading experience...</div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="text-left px-4 py-3">Company</th>
                <th className="text-left px-4 py-3">Position</th>
                <th className="text-left px-4 py-3">Dates</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-3 font-medium">{item.company}</td>
                  <td className="px-4 py-3">{item.position}</td>
                  <td className="px-4 py-3">
                    {item.startDate ?? item.start_date} –{" "}
                    {item.endDate ?? item.end_date}
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
        title={editing ? "Edit Experience" : "Add Experience"}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminFormInput
              label="Company"
              name="company"
              value={form.company}
              onChange={handleChange}
              required
            />
            <AdminFormInput
              label="Position / Role"
              name="position"
              value={form.position}
              onChange={handleChange}
              required
            />
            <AdminFormInput
              label="Start Date (e.g. Jan 2023)"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              required
            />
            <AdminFormInput
              label="End Date (e.g. Dec 2023 or Present)"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              required
            />
            <AdminFormInput
              label="Employment Type (e.g. Full-time)"
              name="type"
              value={form.type}
              onChange={handleChange}
            />
            <AdminFormInput
              label="Location"
              name="location"
              value={form.location}
              onChange={handleChange}
            />
            <AdminFormInput
              label="Sort Order"
              name="sortOrder"
              value={form.sortOrder}
              onChange={handleChange}
              type="number"
            />
          </div>
          <AdminFormTextarea
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
          />
          <AdminTagInput
            label="Skills Used"
            values={form.skills}
            onChange={(values) => setForm((prev) => ({ ...prev, skills: values }))}
            placeholder="Add skill"
          />
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
