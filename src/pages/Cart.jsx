import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { formatEUR } from "../lib/money.js";
import QtyPicker from "../components/QtyPicker.jsx";
import { createOrder } from "../api/orders.js";

/**
 * Cart:
 * - list items
 * - adjust qty
 * - remove
 * - totals
 * ✅ Checkout now creates order in backend and clears cart
 */
export default function Cart() {
  const cart = useCart();

  const shipping = cart.subtotal > 60 ? 0 : cart.items.length ? 4.9 : 0;
  const total = cart.subtotal + shipping;

  async function handleCheckout() {
    try {
      // Create order in backend from the cart items
      const order = await createOrder(cart.items);

      // Empty cart after successful checkout
      cart.clear();

      alert(`✅ Order created: ${order.id} (Status: ${order.status})`);
    } catch (e) {
      console.error(e);
      alert("❌ Checkout failed. Make sure backend is running and try again.");
    }
  }

  if (cart.items.length === 0) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-2xl font-semibold tracking-tight">Your cart</h1>
        <p className="mt-3 text-sm text-zinc-600">Your cart is empty.</p>
        <Link
          to="/products"
          className="mt-5 inline-flex rounded-xl bg-zinc-900 text-white px-5 py-2.5 text-sm font-medium hover:bg-zinc-800"
        >
          Browse products
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Your cart</h1>
          <p className="text-sm text-zinc-600">
            Review items and adjust quantity.
          </p>
        </div>

        <button
          className="text-sm font-medium text-zinc-700 hover:text-zinc-900"
          onClick={() => cart.clear()}
          type="button"
        >
          Clear cart
        </button>
      </div>

      <div className="mt-7 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-zinc-200 bg-white p-4 flex gap-4"
            >
              <div className="h-24 w-20 rounded-xl overflow-hidden bg-zinc-100 shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      to={`/products/${item.id}`}
                      className="font-medium hover:underline truncate block"
                      title={item.name}
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs text-zinc-500 mt-1">{item.category}</p>
                  </div>
                  <p className="font-semibold">{formatEUR(item.price)}</p>
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <QtyPicker
                    value={item.qty}
                    onChange={(qty) => cart.setQty(item.id, qty)}
                  />

                  <button
                    className="text-sm font-medium text-zinc-700 hover:text-zinc-900"
                    onClick={() => cart.remove(item.id)}
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 h-fit">
          <h2 className="text-sm font-semibold">Order summary</h2>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-zinc-700">
              <span>Subtotal</span>
              <span>{formatEUR(cart.subtotal)}</span>
            </div>
            <div className="flex justify-between text-zinc-700">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : formatEUR(shipping)}</span>
            </div>

            <div className="pt-3 mt-3 border-t border-zinc-200 flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatEUR(total)}</span>
            </div>
          </div>

          <button
            className="mt-5 w-full rounded-xl bg-zinc-900 text-white px-5 py-3 text-sm font-medium hover:bg-zinc-800"
            type="button"
            onClick={handleCheckout}
          >
            Checkout
          </button>

          <p className="mt-3 text-xs text-zinc-500">
            Checkout creates an order in SQLite (status: PENDING) and clears the
            cart.
          </p>
        </div>
      </div>
    </section>
  );
}
