import { useEffect, useState } from "react";
import api from "../lib/api.js";
import Modal from "../components/Modal.jsx";
import FormInput from "../components/FormInput.jsx";
import Toast from "../components/Toast.jsx";
import useToast from "../hooks/useToast.js";

const emptyForm = {
  platform: "",
  url: "",
  iconName: "",
  sortOrder: 0,
};

const Socials = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const { toast, showToast } = useToast();

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/socials");
      setItems(response.data.data);
    } catch (error) {
      showToast("Failed to load socials", "error");
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
      platform: item.platform,
      url: item.url,
      iconName: item.iconName,
      sortOrder: item.sortOrder || 0,
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
      const payload = { ...form, sortOrder: Number(form.sortOrder) };
      if (editing) {
        await api.put(`/api/socials/${editing._id}`, payload);
        showToast("Social link updated");
      } else {
        await api.post("/api/socials", payload);
        showToast("Social link created");
      }
      setModalOpen(false);
      fetchItems();
    } catch (error) {
      showToast("Save failed", "error");
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm("Delete this link?")) return;
    try {
      await api.delete(`/api/socials/${itemId}`);
      showToast("Social link deleted");
      fetchItems();
    } catch (error) {
      showToast("Delete failed", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Social Links</h2>
        <button
          onClick={openCreate}
          className="px-4 py-2 bg-slate-900 text-white rounded-md"
        >
          Add Social
        </button>
      </div>

      {loading ? (
        <div className="text-slate-500">Loading socials...</div>
      ) : (
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
              {items.map((item) => (
                <tr key={item._id} className="border-t">
                  <td className="px-4 py-3 font-medium">{item.platform}</td>
                  <td className="px-4 py-3">{item.url}</td>
                  <td className="px-4 py-3">{item.iconName}</td>
                  <td className="px-4 py-3">{item.sortOrder}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => openEdit(item)}
                      className="text-slate-700 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
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
        title={editing ? "Edit Social" : "Add Social"}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <FormInput
            label="Platform"
            name="platform"
            value={form.platform}
            onChange={handleChange}
            required
          />
          <FormInput
            label="URL"
            name="url"
            value={form.url}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Icon Name"
            name="iconName"
            value={form.iconName}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Sort Order"
            name="sortOrder"
            value={form.sortOrder}
            onChange={handleChange}
            type="number"
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
      </Modal>
      <Toast toast={toast} />
    </div>
  );
};

export default Socials;
