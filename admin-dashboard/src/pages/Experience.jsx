import { useEffect, useState } from "react";
import api from "../lib/api.js";
import Modal from "../components/Modal.jsx";
import FormInput from "../components/FormInput.jsx";
import FormTextarea from "../components/FormTextarea.jsx";
import TagInput from "../components/TagInput.jsx";
import Toast from "../components/Toast.jsx";
import useToast from "../hooks/useToast.js";

const emptyForm = {
  company: "",
  role: "",
  startDate: "",
  endDate: "",
  description: "",
  type: "",
  location: "",
  skills: [],
  sortOrder: 0,
};

const Experience = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const { toast, showToast } = useToast();

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/experience");
      setItems(response.data.data);
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
      company: item.company,
      role: item.role,
      startDate: item.startDate,
      endDate: item.endDate,
      description: item.description,
      type: item.type || "",
      location: item.location || "",
      skills: item.skills || [],
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
      if (editing) {
        await api.put(`/api/experience/${editing._id}`, form);
        showToast("Experience updated");
      } else {
        await api.post("/api/experience", form);
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
      await api.delete(`/api/experience/${itemId}`);
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
                <th className="text-left px-4 py-3">Role</th>
                <th className="text-left px-4 py-3">Dates</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id} className="border-t">
                  <td className="px-4 py-3 font-medium">{item.company}</td>
                  <td className="px-4 py-3">{item.role}</td>
                  <td className="px-4 py-3">
                    {item.startDate} - {item.endDate}
                  </td>
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
        title={editing ? "Edit Experience" : "Add Experience"}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Company"
              name="company"
              value={form.company}
              onChange={handleChange}
              required
            />
            <FormInput
              label="Role"
              name="role"
              value={form.role}
              onChange={handleChange}
              required
            />
            <FormInput
              label="Start Date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              required
            />
            <FormInput
              label="End Date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              required
            />
            <FormInput
              label="Type"
              name="type"
              value={form.type}
              onChange={handleChange}
            />
            <FormInput
              label="Location"
              name="location"
              value={form.location}
              onChange={handleChange}
            />
            <FormInput
              label="Sort Order"
              name="sortOrder"
              value={form.sortOrder}
              onChange={handleChange}
              type="number"
            />
          </div>
          <FormTextarea
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
          />
          <TagInput
            label="Skills"
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
      </Modal>
      <Toast toast={toast} />
    </div>
  );
};

export default Experience;
