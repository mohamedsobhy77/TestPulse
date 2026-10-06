import { SOURCES } from "@/lib/sources";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-[#0a0e1a]">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <div className="text-lg font-bold">
            Test<span className="text-sky-400">Pulse</span>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Aggregated trends in software testing and AI testing from the top
            10 news and blog sources, refreshed automatically.
          </p>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Feeds
          </div>
          <ul className="mt-3 grid grid-cols-1 gap-2 text-sm text-slate-400 sm:grid-cols-2">
            {SOURCES.map((s) => (
              <li key={s.id}>
                <a
                  href={s.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-sky-400"
                >
                  {s.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Categories
          </div>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            <li>Software Testing — automation, CI/CD, strategy</li>
            <li>AI Testing — GenAI, self-healing, agentic tests</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-slate-500">
        Built with Next.js + React. All articles belong to their original
        publishers.
      </div>
    </footer>
  );
}
