import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          The page you requested does not exist.
        </p>
        <Link
          to="/"
          className="mt-5 inline-flex rounded-xl bg-zinc-900 text-white px-5 py-2.5 text-sm font-medium hover:bg-zinc-800"
        >
          Go home
        </Link>
      </div>
    </section>
  );
}
