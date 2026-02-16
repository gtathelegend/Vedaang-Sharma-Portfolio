import { useEffect, useState } from "react";
import api from "../lib/api.js";
import Modal from "../components/Modal.jsx";
import FormInput from "../components/FormInput.jsx";
import FormSelect from "../components/FormSelect.jsx";
import Toast from "../components/Toast.jsx";
import useToast from "../hooks/useToast.js";

const emptyForm = { name: "", category: "frontend", level: "beginner" };

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const { toast, showToast } = useToast();

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/skills");
      setSkills(response.data.data);
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
      level: skill.level,
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
        await api.put(`/api/skills/${editing._id}`, form);
        showToast("Skill updated");
      } else {
        await api.post("/api/skills", form);
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
      await api.delete(`/api/skills/${skillId}`);
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
                <th className="text-left px-4 py-3">Level</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {skills.map((skill) => (
                <tr key={skill._id} className="border-t">
                  <td className="px-4 py-3 font-medium">{skill.name}</td>
                  <td className="px-4 py-3">{skill.category}</td>
                  <td className="px-4 py-3">{skill.level}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => openEdit(skill)}
                      className="text-slate-700 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(skill._id)}
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
        title={editing ? "Edit Skill" : "Add Skill"}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <FormInput
            label="Skill Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSelect
              label="Category"
              name="category"
              value={form.category}
              onChange={handleChange}
              options={[
                { value: "frontend", label: "Frontend" },
                { value: "backend", label: "Backend" },
                { value: "tools", label: "Tools" },
              ]}
            />
            <FormSelect
              label="Level"
              name="level"
              value={form.level}
              onChange={handleChange}
              options={[
                { value: "beginner", label: "Beginner" },
                { value: "intermediate", label: "Intermediate" },
                { value: "advanced", label: "Advanced" },
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
      </Modal>
      <Toast toast={toast} />
    </div>
  );
};

export default Skills;
