import React, { useEffect, useState } from "react";
import { adminListOrders, adminSetOrderStatus } from "../../api/admin.js";
import { formatEUR } from "../../lib/money.js";

const TABS = ["ALL", "PENDING", "DISPATCHED", "READY"];

export default function AdminOrders() {
  const [tab, setTab] = useState("ALL");
  const [orders, setOrders] = useState([]);

  async function refresh(nextTab = tab) {
    setOrders(await adminListOrders(nextTab));
  }

  useEffect(() => {
    refresh(tab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  async function setStatus(id, status) {
    await adminSetOrderStatus(id, status);
    await refresh(tab);
  }

  return (
    <div>
      <h1 className="text-xl font-semibold tracking-tight">Orders</h1>
      <p className="mt-1 text-sm text-zinc-600">
        View orders and mark status (Pending → Dispatched → Ready).
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-xl px-4 py-2 text-sm font-medium border ${
              tab === t
                ? "bg-zinc-900 text-white border-zinc-900"
                : "bg-white text-zinc-800 border-zinc-200 hover:bg-zinc-50"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        {orders.map((o) => (
          <div
            key={o.id}
            className="rounded-2xl border border-zinc-200 bg-white p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium">Order #{o.id}</p>
                <p className="text-xs text-zinc-500">
                  {o.created_at} · Items: {o.item_count}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatEUR(o.total)}</p>
                <p className="text-xs text-zinc-500">Status: {o.status}</p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                className="rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium hover:bg-zinc-50"
                type="button"
                onClick={() => setStatus(o.id, "DISPATCHED")}
                disabled={o.status === "READY"}
              >
                Mark Dispatched
              </button>
              <button
                className="rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium hover:bg-zinc-50"
                type="button"
                onClick={() => setStatus(o.id, "READY")}
                disabled={o.status === "READY"}
              >
                Mark Ready
              </button>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <p className="text-sm text-zinc-600 mt-6">
            No orders found for this tab.
          </p>
        )}
      </div>
    </div>
  );
}
