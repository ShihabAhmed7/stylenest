import React from "react";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-zinc-600 flex flex-col gap-2">
        <p className="font-medium text-zinc-800">StyleNest</p>
        <p>
          Minimal demo shop (Jamil, Shihab, Amna)
        </p>
        <p className="text-xs text-zinc-500">© {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
