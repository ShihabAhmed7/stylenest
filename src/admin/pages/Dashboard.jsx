import React, { useEffect, useState } from "react";
import { getAdminMetrics } from "../../api/admin.js";
import { formatEUR } from "../../lib/money.js";

function Card({ label, value }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
    </div>
  );
}

export default function Dashboard() {
  const [m, setM] = useState(null);

  useEffect(() => {
    let ok = true;
    getAdminMetrics().then((data) => ok && setM(data));
    return () => {
      ok = false;
    };
  }, []);

  if (!m) return <p className="text-sm text-zinc-600">Loading metrics…</p>;

  return (
    <div>
      <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-1 text-sm text-zinc-600">
        Quick overview: sales, orders, products.
      </p>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card label="Total Sales" value={formatEUR(m.totalSales)} />
        <Card label="Pending Orders" value={m.ordersPending} />
        <Card label="Dispatched Orders" value={m.ordersDispatched} />
        <Card label="Ready Orders" value={m.ordersReady} />
        <Card label="Products" value={m.productsCount} />
        <Card label="Categories" value={m.categoriesCount} />
      </div>
    </div>
  );
}
