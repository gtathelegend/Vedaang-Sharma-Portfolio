import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api.js";
import Toast from "../components/Toast.jsx";
import useToast from "../hooks/useToast.js";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { toast, showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/auth/login", form);
      navigate("/admin/dashboard");
    } catch (error) {
      showToast("Login failed. Check credentials.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 space-y-6"
      >
        <div>
          <h1 className="text-2xl font-semibold">Admin Login</h1>
          <p className="text-slate-500 text-sm">Use your admin credentials</p>
        </div>
        <label className="flex flex-col gap-2 text-sm">
          <span>Email</span>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="rounded-md border border-slate-300 px-3 py-2"
            required
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span>Password</span>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="rounded-md border border-slate-300 px-3 py-2"
            required
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-slate-900 text-white py-2 rounded-md hover:bg-slate-800 transition"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <Toast toast={toast} />
    </div>
  );
};

export default Login;
