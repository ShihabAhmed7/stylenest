import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

// Minimal admin shell: sidebar + topbar + main content
export default function AdminLayout() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("admin_token");
    navigate("/admin/login");
  }

  const linkBase =
    "block rounded-xl px-3 py-2 text-sm font-medium hover:bg-zinc-100";
  const linkActive = "bg-zinc-900 text-white hover:bg-zinc-900";

  return (
    <div className="min-h-[calc(100vh-64px)] bg-zinc-50">
      <div className="mx-auto max-w-6xl px-4 py-8 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
        <aside className="rounded-2xl border border-zinc-200 bg-white p-3 h-fit">
          <div className="px-3 py-2">
            <p className="text-xs text-zinc-500">ADMIN</p>
            <p className="font-semibold">StyleNest Dashboard</p>
          </div>

          <nav className="mt-2 space-y-1">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : "text-zinc-800"}`
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/admin/products"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : "text-zinc-800"}`
              }
            >
              Products
            </NavLink>

            <NavLink
              to="/admin/categories"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : "text-zinc-800"}`
              }
            >
              Categories
            </NavLink>

            <NavLink
              to="/admin/orders"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : "text-zinc-800"}`
              }
            >
              Orders
            </NavLink>

            <NavLink
              to="/admin/sales"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : "text-zinc-800"}`
              }
            >
              Sales
            </NavLink>
          </nav>

          <button
            onClick={logout}
            className="mt-4 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium hover:bg-zinc-50"
            type="button"
          >
            Logout
          </button>
        </aside>

        <section className="rounded-2xl border border-zinc-200 bg-white p-5">
          <Outlet />
        </section>
      </div>
    </div>
  );
}
