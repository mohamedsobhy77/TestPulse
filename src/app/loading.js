export default function Loading() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-16">
      <div className="h-8 w-64 animate-pulse rounded bg-white/10" />
      <div className="h-4 w-96 animate-pulse rounded bg-white/5" />
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-72 animate-pulse rounded-xl border border-white/10 bg-white/5"
          />
        ))}
      </div>
    </div>
  );
}
