import React, { useEffect, useState } from "react";
import {
  adminCreateCategory,
  adminDeleteCategory,
  adminListCategories,
} from "../../api/admin.js";

export default function AdminCategories() {
  const [cats, setCats] = useState([]);
  const [name, setName] = useState("");

  async function refresh() {
    setCats(await adminListCategories());
  }

  useEffect(() => {
    refresh();
  }, []);

  async function add(e) {
    e.preventDefault();
    if (!name.trim()) return;
    await adminCreateCategory(name.trim());
    setName("");
    await refresh();
  }

  async function del(id) {
    if (!confirm("Delete this category?")) return;
    await adminDeleteCategory(id);
    await refresh();
  }

  return (
    <div>
      <h1 className="text-xl font-semibold tracking-tight">Categories</h1>
      <p className="mt-1 text-sm text-zinc-600">Manage product categories.</p>

      <form onSubmit={add} className="mt-5 flex gap-2">
        <input
          className="flex-1 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
          placeholder="New category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          className="rounded-xl bg-zinc-900 text-white px-4 py-2 text-sm font-medium hover:bg-zinc-800"
          type="submit"
        >
          Add
        </button>
      </form>

      <div className="mt-5 space-y-2">
        {cats.map((c) => (
          <div
            key={c.id}
            className="rounded-2xl border border-zinc-200 bg-white p-4 flex items-center justify-between"
          >
            <p className="font-medium">{c.name}</p>
            <button
              className="rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium hover:bg-zinc-50"
              onClick={() => del(c.id)}
              type="button"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {cats.length === 0 && (
        <p className="mt-6 text-sm text-zinc-600">No categories yet.</p>
      )}
    </div>
  );
}
