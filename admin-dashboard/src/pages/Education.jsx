import { useEffect, useState } from "react";
import api from "../lib/api.js";
import Modal from "../components/Modal.jsx";
import FormInput from "../components/FormInput.jsx";
import FormTextarea from "../components/FormTextarea.jsx";
import TagInput from "../components/TagInput.jsx";
import Toast from "../components/Toast.jsx";
import useToast from "../hooks/useToast.js";

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

const Education = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const { toast, showToast } = useToast();

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/education");
      setItems(response.data.data);
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
      institute: item.institute,
      degree: item.degree,
      startYear: item.startYear,
      endYear: item.endYear,
      summary: item.summary || "",
      gpa: item.gpa || "",
      images: item.images || [],
      achievements: item.achievements || [],
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
        await api.put(`/api/education/${editing._id}`, payload);
        showToast("Education updated");
      } else {
        await api.post("/api/education", payload);
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
      await api.delete(`/api/education/${itemId}`);
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
                <tr key={item._id} className="border-t">
                  <td className="px-4 py-3 font-medium">{item.institute}</td>
                  <td className="px-4 py-3">{item.degree}</td>
                  <td className="px-4 py-3">
                    {item.startYear} - {item.endYear}
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
        title={editing ? "Edit Education" : "Add Education"}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Institute"
              name="institute"
              value={form.institute}
              onChange={handleChange}
              required
            />
            <FormInput
              label="Degree"
              name="degree"
              value={form.degree}
              onChange={handleChange}
              required
            />
            <FormInput
              label="Start Year"
              name="startYear"
              value={form.startYear}
              onChange={handleChange}
              required
            />
            <FormInput
              label="End Year"
              name="endYear"
              value={form.endYear}
              onChange={handleChange}
              required
            />
            <FormInput
              label="GPA"
              name="gpa"
              value={form.gpa}
              onChange={handleChange}
            />
          </div>
          <FormTextarea
            label="Summary"
            name="summary"
            value={form.summary}
            onChange={handleChange}
          />
          <TagInput
            label="Images"
            values={form.images}
            onChange={(values) => setForm((prev) => ({ ...prev, images: values }))}
            placeholder="Add image URL"
          />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Achievements</h3>
              <button
                type="button"
                onClick={addAchievement}
                className="px-3 py-2 bg-slate-900 text-white rounded-md"
              >
                Add Achievement
              </button>
            </div>
            {form.achievements.map((achievement, index) => (
              <div
                key={`${achievement.title}-${index}`}
                className="border border-slate-200 rounded-lg p-4 space-y-3"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="Year"
                    value={achievement.year}
                    onChange={(event) =>
                      updateAchievement(index, "year", event.target.value)
                    }
                  />
                  <FormInput
                    label="Date"
                    value={achievement.date}
                    onChange={(event) =>
                      updateAchievement(index, "date", event.target.value)
                    }
                  />
                  <FormInput
                    label="Title"
                    value={achievement.title}
                    onChange={(event) =>
                      updateAchievement(index, "title", event.target.value)
                    }
                  />
                  <FormInput
                    label="Subtitle"
                    value={achievement.subtitle}
                    onChange={(event) =>
                      updateAchievement(index, "subtitle", event.target.value)
                    }
                  />
                  <FormInput
                    label="Gradient Color"
                    value={achievement.color}
                    onChange={(event) =>
                      updateAchievement(index, "color", event.target.value)
                    }
                  />
                  <FormInput
                    label="Icon Name"
                    value={achievement.iconName}
                    onChange={(event) =>
                      updateAchievement(index, "iconName", event.target.value)
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
      </Modal>
      <Toast toast={toast} />
    </div>
  );
};

export default Education;
