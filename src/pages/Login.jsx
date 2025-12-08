import React, { useState } from "react";
import { Link } from "react-router-dom";

/**
 * Simple auth pages for UI only.
 * Later you can connect to backend endpoints:
 * POST /auth/login (Express + SQLite)
 */
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function onSubmit(e) {
    e.preventDefault();
    alert("Login later: connect to Express + SQLite API");
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="mx-auto max-w-md rounded-3xl border border-zinc-200 bg-white p-7 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Demo UI. Backend authentication later.
        </p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <label className="block">
            <span className="text-sm font-medium">Email</span>
            <input
              className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
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
              placeholder="••••••••"
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
        </form>

        <p className="mt-4 text-sm text-zinc-600">
          No account?{" "}
          <Link to="/register" className="font-medium hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </section>
  );
}
