import React from "react";

/**
 * Minimal quantity control.
 * Kept reusable so Cart page stays clean.
 */
export default function QtyPicker({ value, onChange }) {
  return (
    <div className="inline-flex items-center rounded-xl border border-zinc-200 bg-white overflow-hidden">
      <button
        className="px-3 py-2 text-zinc-700 hover:bg-zinc-50"
        onClick={() => onChange(Math.max(1, value - 1))}
        type="button"
        aria-label="Decrease quantity"
      >
        −
      </button>
      <input
        className="w-12 text-center text-sm outline-none"
        value={value}
        onChange={(e) => {
          const n = Number(e.target.value);
          onChange(Number.isFinite(n) ? n : value);
        }}
        inputMode="numeric"
      />
      <button
        className="px-3 py-2 text-zinc-700 hover:bg-zinc-50"
        onClick={() => onChange(value + 1)}
        type="button"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
