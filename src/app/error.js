"use client";

export default function Error({ error, reset }) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center">
      <h2 className="text-2xl font-bold">Something went wrong</h2>
      <p className="text-sm text-slate-400">
        {error?.message || "Failed to load the latest testing trends."}
      </p>
      <button
        onClick={reset}
        className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm text-slate-200 hover:border-sky-400/50"
      >
        Try again
      </button>
    </div>
  );
}
