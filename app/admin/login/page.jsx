"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiUrl } from "@/lib/api";
import { isAdminAuthenticated, setAdminToken } from "@/lib/adminAuth";
import AdminToast from "@/app/admin/components/AdminToast";
import useAdminToast from "@/app/admin/hooks/useAdminToast";

export default function AdminLoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast, showToast } = useAdminToast();
  const nextPath = searchParams.get("next") || "/admin/dashboard";

  useEffect(() => {
    if (isAdminAuthenticated()) {
      router.replace(nextPath);
    }
  }, [nextPath, router]);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(apiUrl("/api/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const body = await response.json();

      if (!response.ok) {
        throw new Error(body?.message || "Login failed");
      }

      setAdminToken(body.token);
      router.push(nextPath);
    } catch (error) {
      showToast(error.message || "Login failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
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

      <AdminToast toast={toast} />
    </div>
  );
}
