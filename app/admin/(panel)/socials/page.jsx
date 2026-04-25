"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminApi";
import AdminModal from "@/app/admin/components/AdminModal";
import AdminConfirmModal from "@/app/admin/components/AdminConfirmModal";
import AdminSearchInput from "@/app/admin/components/AdminSearchInput";
import AdminFormInput from "@/app/admin/components/AdminFormInput";
import AdminToast from "@/app/admin/components/AdminToast";
import useAdminToast from "@/app/admin/hooks/useAdminToast";

const emptyForm = { platform: "", url: "", iconName: "", sortOrder: 0 };

export default function AdminSocialsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const { toast, showToast } = useAdminToast();

  const fetchItems = async () => {
    setLoading(true);
    try { const res = await adminFetch("/api/socials"); setItems(res.data || []); }
    catch { showToast("Failed to load socials", "error"); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchItems(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (item) => {
    setEditing(item);
    setForm({ platform: item.platform, url: item.url, iconName: item.iconName, sortOrder: item.sortOrder || 0 });
    setModalOpen(true);
  };
  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, sortOrder: Number(form.sortOrder) };
      if (editing) await adminFetch(`/api/socials/${editing._id}`, { method: "PUT", body: JSON.stringify(payload) });
      else await adminFetch("/api/socials", { method: "POST", body: JSON.stringify(payload) });
      showToast(editing ? "Social link updated" : "Social link created");
      setModalOpen(false); fetchItems();
    } catch { showToast("Save failed", "error"); }
  };

  const handleDelete = async () => {
    try { await adminFetch(`/api/socials/${confirmId}`, { method: "DELETE" }); showToast("Social link deleted"); fetchItems(); }
    catch { showToast("Delete failed", "error"); }
    finally { setConfirmId(null); }
  };

  const filtered = items.filter((i) =>
    i.platform?.toLowerCase().includes(search.toLowerCase()) || i.url?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Social Links</h2>
        <button onClick={openCreate} className="px-4 py-2 bg-slate-900 text-white rounded-md">Add Social</button>
      </div>
      <AdminSearchInput value={search} onChange={setSearch} placeholder="Search socials..." />
      {loading ? <div className="text-slate-500">Loading socials...</div> : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="text-left px-4 py-3">Platform</th>
                <th className="text-left px-4 py-3">URL</th>
                <th className="text-left px-4 py-3">Icon</th>
                <th className="text-left px-4 py-3">Order</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item._id} className="border-t hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium">{item.platform}</td>
                  <td className="px-4 py-3 truncate max-w-xs text-slate-500">{item.url}</td>
                  <td className="px-4 py-3 font-mono text-xs">{item.iconName}</td>
                  <td className="px-4 py-3">{item.sortOrder}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button onClick={() => openEdit(item)} className="text-slate-700 hover:underline">Edit</button>
                    <button onClick={() => setConfirmId(item._id)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={5} className="px-4 py-6 text-center text-slate-400">No social links found</td></tr>}
            </tbody>
          </table>
        </div>
      )}
      <AdminModal open={modalOpen} title={editing ? "Edit Social" : "Add Social"} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSave} className="space-y-4">
          <AdminFormInput label="Platform" name="platform" value={form.platform} onChange={handleChange} required />
          <AdminFormInput label="URL" name="url" value={form.url} onChange={handleChange} required type="url" />
          <AdminFormInput label="Icon Name (e.g. faGithub)" name="iconName" value={form.iconName} onChange={handleChange} required />
          <AdminFormInput label="Sort Order" name="sortOrder" value={form.sortOrder} onChange={handleChange} type="number" />
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-md border border-slate-300">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-md bg-slate-900 text-white">Save</button>
          </div>
        </form>
      </AdminModal>
      <AdminConfirmModal open={!!confirmId} title="Delete social link?"
        description="This will permanently remove this social link."
        onConfirm={handleDelete} onCancel={() => setConfirmId(null)} />
      <AdminToast toast={toast} />
    </div>
  );
}
