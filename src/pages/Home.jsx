import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import { listProducts } from "../api/products.js";

/**
 * Home shows a hero + a small product preview.
 * Products come from api/products.js (hardcoded now, API later).
 */
export default function Home() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let mounted = true;
    listProducts().then((data) => mounted && setItems(data.slice(0, 4)));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-10 pb-8">
        <div className="rounded-3xl border border-zinc-200 bg-white p-8 md:p-12 shadow-sm">
          <p className="text-xs font-medium text-zinc-500">NEW SEASON</p>
          <h1 className="mt-2 text-3xl md:text-5xl font-semibold tracking-tight">
            Minimal pieces.{" "}
            <span className="text-zinc-500">Everyday comfort.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-zinc-600">
            A clean demo storefront built with React + Vite + Tailwind. Backend
            will be Node.js + Express + SQLite.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/products"
              className="inline-flex items-center justify-center rounded-xl bg-zinc-900 text-white px-5 py-2.5 text-sm font-medium hover:bg-zinc-800"
            >
              Browse products
            </Link>
            <Link
              to="/cart"
              className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium hover:bg-zinc-50"
            >
              View cart
            </Link>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Featured picks
            </h2>
            <p className="text-sm text-zinc-600">
              A few items to preview the UI.
            </p>
          </div>

          <Link
            to="/products"
            className="text-sm font-medium text-zinc-700 hover:text-zinc-900"
          >
            View all →
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
