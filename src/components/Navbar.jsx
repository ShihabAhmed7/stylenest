import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

// Simple inline cart icon (no extra libraries)
function CartIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 6h15l-1.5 9h-12L6 6Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M6 6 5.5 3H3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM18 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

const linkBase =
  "text-sm font-medium text-zinc-700 hover:text-zinc-900 transition";
const linkActive = "text-zinc-900";

export default function Navbar() {
  const cart = useCart();

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-zinc-200">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-zinc-900 text-white grid place-items-center font-semibold">
            S
          </div>
          <span className="font-semibold tracking-tight">StyleNest</span>
        </Link>

        <nav className="flex items-center gap-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : ""}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : ""}`
            }
          >
            Products
          </NavLink>
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : ""}`
            }
          >
            Login
          </NavLink>

          <Link
            to="/cart"
            className="relative inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 hover:bg-zinc-50 transition"
            aria-label="Open cart"
          >
            <CartIcon className="h-5 w-5 text-zinc-800" />
            <span className="text-sm font-medium">Cart</span>

            {cart.count > 0 && (
              <span className="absolute -top-2 -right-2 h-5 min-w-5 px-1 rounded-full bg-zinc-900 text-white text-[11px] grid place-items-center">
                {cart.count}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
