import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../../api/admin.js";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@stylenest.local");
  const [password, setPassword] = useState("admin123");
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");

    try {
      const data = await adminLogin(email, password);
      localStorage.setItem("admin_token", data.token);
      navigate("/admin");
    } catch (e2) {
      setErr("Login failed. Check email/password.");
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="mx-auto max-w-md rounded-3xl border border-zinc-200 bg-white p-7 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight">Admin Login</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Owner dashboard. Token stored in localStorage.
        </p>

        {err && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {err}
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <label className="block">
            <span className="text-sm font-medium">Email</span>
            <input
              className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium">Password</span>
            <input
              className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />
          </label>

          <button
            className="w-full rounded-xl bg-zinc-900 text-white px-5 py-2.5 text-sm font-medium hover:bg-zinc-800"
            type="submit"
          >
            Sign in
          </button>

          <p className="text-xs text-zinc-500">
            Default demo admin: admin@stylenest.local / admin123
          </p>
        </form>
      </div>
    </section>
  );
}
