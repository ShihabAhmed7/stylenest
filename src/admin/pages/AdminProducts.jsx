import React, { useEffect, useMemo, useState } from "react";
import {
  adminCreateProduct,
  adminDeleteProduct,
  adminListCategories,
  adminListProducts,
  adminUpdateProduct,
} from "../../api/admin.js";
import { formatEUR } from "../../lib/money.js";

/**
 * Minimal CRUD:
 * - left: list
 * - right: form for create/edit
 * Keeps code easy to understand.
 */
export default function AdminProducts() {
  const [items, setItems] = useState([]);
  const [cats, setCats] = useState([]);
  const [q, setQ] = useState("");

  // form state
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    category: "Tops",
    price: 19.9,
    image: "",
    description: "",
  });

  async function refresh() {
    const [p, c] = await Promise.all([adminListProducts(), adminListCategories()]);
    setItems(p);
    setCats(c);
    if (c[0] && !c.find((x) => x.name === form.category)) {
      setForm((f) => ({ ...f, category: c[0].name }));
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        p.category.toLowerCase().includes(s) ||
        p.description.toLowerCase().includes(s)
    );
  }, [items, q]);

  function startCreate() {
    setEditingId(null);
    setForm({
      name: "",
      category: cats[0]?.name || "Tops",
      price: 19.9,
      image: "",
      description: "",
    });
  }

  function startEdit(p) {
    setEditingId(p.id);
    setForm({
      name: p.name,
      category: p.category,
      price: p.price,
      image: p.image,
      description: p.description,
    });
  }

  async function onSubmit(e) {
    e.preventDefault();

    // Basic validation
    if (!form.name.trim()) return alert("Name required");
    if (!form.image.trim()) return alert("Image URL required");
    if (!form.description.trim()) return alert("Description required");

    if (editingId) {
      await adminUpdateProduct(editingId, form);
    } else {
      await adminCreateProduct(form);
    }

    await refresh();
    startCreate();
  }

  async function onDelete(id) {
    if (!confirm("Delete this product?")) return;
    await adminDeleteProduct(id);
    await refresh();
    if (editingId === id) startCreate();
  }

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Products</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Create, edit, delete products.
          </p>
        </div>

        <button
          onClick={startCreate}
          className="rounded-xl bg-zinc-900 text-white px-4 py-2 text-sm font-medium hover:bg-zinc-800"
          type="button"
        >
          New product
        </button>
      </div>

      <div className="mt-5 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        {/* List */}
        <div>
          <input
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
            placeholder="Search products..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          <div className="mt-4 space-y-3">
            {filtered.map((p) => (
              <div
                key={p.id}
                className="rounded-2xl border border-zinc-200 bg-white p-4 flex gap-4"
              >
                <div className="h-16 w-14 rounded-xl overflow-hidden bg-zinc-100 shrink-0">
                  <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium truncate">{p.name}</p>
                      <p className="text-xs text-zinc-500">{p.category}</p>
                    </div>
                    <p className="text-sm font-semibold">{formatEUR(p.price)}</p>
                  </div>

                  <div className="mt-2 flex gap-2">
                    <button
                      className="rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium hover:bg-zinc-50"
                      type="button"
                      onClick={() => startEdit(p)}
                    >
                      Edit
                    </button>
                    <button
                      className="rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium hover:bg-zinc-50"
                      type="button"
                      onClick={() => onDelete(p.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <p className="text-sm text-zinc-600 mt-6">No products found.</p>
            )}
          </div>
        </div>

        {/* Form */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 h-fit">
          <h2 className="text-sm font-semibold">
            {editingId ? "Edit product" : "Create product"}
          </h2>

          <form className="mt-4 space-y-3" onSubmit={onSubmit}>
            <label className="block">
              <span className="text-xs font-medium text-zinc-700">Name</span>
              <input
                className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
            </label>

            <label className="block">
              <span className="text-xs font-medium text-zinc-700">Category</span>
              <select
                className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value }))
                }
              >
                {cats.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-medium text-zinc-700">Price</span>
              <input
                className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) =>
                  setForm((f) => ({ ...f, price: Number(e.target.value) }))
                }
                required
              />
            </label>

            <label className="block">
              <span className="text-xs font-medium text-zinc-700">Image URL</span>
              <input
                className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
                value={form.image}
                onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                placeholder="https://..."
                required
              />
            </label>

            <label className="block">
              <span className="text-xs font-medium text-zinc-700">Description</span>
              <textarea
                className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
                rows={4}
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                required
              />
            </label>

            <button
              className="w-full rounded-xl bg-zinc-900 text-white px-4 py-2.5 text-sm font-medium hover:bg-zinc-800"
              type="submit"
            >
              {editingId ? "Save changes" : "Create product"}
            </button>

            {editingId && (
              <button
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium hover:bg-zinc-50"
                type="button"
                onClick={startCreate}
              >
                Cancel edit
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
