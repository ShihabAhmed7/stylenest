import React from "react";
import { Link } from "react-router-dom";
import { formatEUR } from "../lib/money.js";
import { useCart } from "../context/CartContext.jsx";

/**
 * Product card:
 * - Rounded corners + soft shadow (style 2)
 * - Category badge + hover add button (style 3)
 * Minimal code, realistic UI.
 */
export default function ProductCard({ product }) {
  const cart = useCart();

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white border border-zinc-200 shadow-sm hover:shadow-md transition">
      {/* Image area */}
      <div className="relative aspect-[4/5] overflow-hidden bg-zinc-100">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
          loading="lazy"
        />

        {/* Category badge */}
        <div className="absolute left-3 top-3">
          <span className="inline-flex items-center rounded-full bg-white/90 backdrop-blur px-3 py-1 text-xs font-medium text-zinc-800 border border-zinc-200">
            {product.category}
          </span>
        </div>

        {/* Hover action */}
        <div className="absolute inset-x-0 bottom-3 px-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition">
          <button
            className="w-full rounded-xl bg-zinc-900 text-white py-2 text-sm font-medium hover:bg-zinc-800"
            onClick={() => cart.add(product)}
            type="button"
          >
            Add to cart
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            to={`/products/${product.id}`}
            className="block font-medium text-zinc-900 hover:underline truncate"
            title={product.name}
          >
            {product.name}
          </Link>
          <p className="mt-1 text-xs text-zinc-500 line-clamp-2">
            {product.description}
          </p>
        </div>

        <div className="text-right shrink-0">
          <p className="text-sm font-semibold">{formatEUR(product.price)}</p>
          <Link
            to={`/products/${product.id}`}
            className="mt-2 inline-flex text-xs font-medium text-zinc-700 hover:text-zinc-900"
          >
            View →
          </Link>
        </div>
      </div>
    </div>
  );
}
