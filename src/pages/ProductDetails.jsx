import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById } from "../api/products.js";
import { formatEUR } from "../lib/money.js";
import { useCart } from "../context/CartContext.jsx";

/**
 * Product details page.
 * Loads product from api/products.js (hardcoded now, API later).
 */
export default function ProductDetails() {
  const { id } = useParams();
  const cart = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    getProductById(id).then((p) => {
      if (!mounted) return;
      setProduct(p);
      setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-sm text-zinc-600">Loading product…</p>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-xl font-semibold">Product not found</h1>
        <p className="mt-2 text-sm text-zinc-600">
          The product ID does not exist.
        </p>
        <Link
          to="/products"
          className="mt-4 inline-flex rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-50"
        >
          Back to products
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 text-sm text-zinc-600">
        <Link to="/products" className="hover:text-zinc-900">
          Products
        </Link>{" "}
        <span className="text-zinc-400">/</span>{" "}
        <span className="text-zinc-800">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image */}
        <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
          <div className="relative aspect-[4/5] bg-zinc-100">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute left-4 top-4">
              <span className="inline-flex items-center rounded-full bg-white/90 backdrop-blur px-3 py-1 text-xs font-medium text-zinc-800 border border-zinc-200">
                {product.category}
              </span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            {product.name}
          </h1>

          <p className="mt-2 text-zinc-600">{product.description}</p>

          <div className="mt-5 flex items-center gap-3">
            <p className="text-xl font-semibold">{formatEUR(product.price)}</p>
            <span className="text-xs text-zinc-500">
              VAT included (demo text)
            </span>
          </div>

          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            <button
              className="rounded-xl bg-zinc-900 text-white px-5 py-3 text-sm font-medium hover:bg-zinc-800"
              onClick={() => cart.add(product)}
              type="button"
            >
              Add to cart
            </button>

            <Link
              to="/cart"
              className="rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium hover:bg-zinc-50 text-center"
            >
              Go to cart
            </Link>
          </div>

          {/* Minimal “details” block */}
          <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-5">
            <h2 className="text-sm font-semibold">Details</h2>
            <ul className="mt-2 text-sm text-zinc-600 space-y-1 list-disc pl-5">
              <li>Quality material (demo)</li>
              <li>Simple sizing (demo)</li>
              <li>Easy return policy (demo)</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
