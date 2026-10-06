import { SOURCES } from "@/lib/sources";

export default function SourceGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {SOURCES.map((source) => {
        const isAi = source.categories.includes("ai-testing");
        return (
          <a
            key={source.id}
            href={source.homepage}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col gap-2 rounded-xl border border-white/10 bg-[#0c111f] p-4 transition-colors hover:border-violet-400/40"
          >
            <div className="flex items-center justify-between">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 text-xs font-bold text-slate-300">
                {source.name.slice(0, 2).toUpperCase()}
              </span>
              <span
                className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                  isAi
                    ? "border-violet-400/30 bg-violet-500/15 text-violet-300"
                    : "border-cyan-400/30 bg-cyan-500/15 text-cyan-300"
                }`}
              >
                {isAi ? "AI Testing" : "Software Testing"}
              </span>
            </div>
            <div className="text-sm font-semibold text-slate-100">
              {source.name}
            </div>
            <p className="text-xs leading-5 text-slate-500">
              {source.description}
            </p>
            <span className="mt-auto text-[11px] text-sky-500">RSS feed &nearr;</span>
          </a>
        );
      })}
    </div>
  );
}
