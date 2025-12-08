import React, { useEffect, useState } from "react";
import { getAdminMetrics, adminListOrders } from "../../api/admin.js";
import { formatEUR } from "../../lib/money.js";

export default function AdminSales() {
  const [m, setM] = useState(null);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    let ok = true;
    Promise.all([getAdminMetrics(), adminListOrders("ALL")]).then(([mm, oo]) => {
      if (!ok) return;
      setM(mm);
      setRecent(oo.slice(0, 10));
    });
    return () => {
      ok = false;
    };
  }, []);

  if (!m) return <p className="text-sm text-zinc-600">Loading sales…</p>;

  return (
    <div>
      <h1 className="text-xl font-semibold tracking-tight">Sales</h1>
      <p className="mt-1 text-sm text-zinc-600">Simple sales overview.</p>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-zinc-500">Total Sales</p>
          <p className="mt-1 text-xl font-semibold">{formatEUR(m.totalSales)}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-zinc-500">Total Orders</p>
          <p className="mt-1 text-xl font-semibold">
            {m.ordersPending + m.ordersDispatched + m.ordersReady}
          </p>
        </div>
      </div>

      <h2 className="mt-7 text-sm font-semibold">Recent orders</h2>
      <div className="mt-3 space-y-2">
        {recent.map((o) => (
          <div
            key={o.id}
            className="rounded-2xl border border-zinc-200 bg-white p-4 flex items-center justify-between"
          >
            <div>
              <p className="font-medium">#{o.id}</p>
              <p className="text-xs text-zinc-500">{o.created_at}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">{formatEUR(o.total)}</p>
              <p className="text-xs text-zinc-500">{o.status}</p>
            </div>
          </div>
        ))}

        {recent.length === 0 && (
          <p className="text-sm text-zinc-600">No orders yet.</p>
        )}
      </div>
    </div>
  );
}
