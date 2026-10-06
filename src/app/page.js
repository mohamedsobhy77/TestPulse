import NewsBrowser from "@/components/NewsBrowser";
import SourceGrid from "@/components/SourceGrid";
import { getAllNews } from "@/lib/news";
import { CATEGORIES, SOURCES } from "@/lib/sources";

export const revalidate = 1800;

export default async function Home() {
  let articles = [];
  let updatedAt = null;
  try {
    articles = await getAllNews();
    updatedAt = new Date().toISOString();
  } catch {
    articles = [];
  }

  return (
    <main className="flex-1">
      <section className="border-b border-white/10 bg-gradient-to-b from-[#0b1224] to-[#070a13]">
        <div className="mx-auto max-w-6xl px-4 py-14 text-center">
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Live from {SOURCES.length} top testing &amp; AI blogs
          </div>
          <h1 className="mx-auto max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            Trends in{" "}
            <span className="bg-gradient-to-r from-sky-400 to-violet-400 bg-clip-text text-transparent">
              Software &amp; AI Testing
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
            One feed for quality engineers: automation updates, CI/CD practice,
            GenAI in QA, self-healing tests and agentic testing — pulled from
            the best 10 news and blog websites.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-2 text-xs">
            {Object.values(CATEGORIES)
              .filter((c) => c.id !== "all")
              .map((cat) => (
                <span
                  key={cat.id}
                  className={`rounded-full border px-3 py-1 ${
                    cat.id === "ai-testing"
                      ? "border-violet-400/30 bg-violet-500/10 text-violet-300"
                      : "border-cyan-400/30 bg-cyan-500/10 text-cyan-300"
                  }`}
                >
                  {cat.label}: {cat.description}
                </span>
              ))}
          </div>
        </div>
      </section>

      <section id="feed" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-10">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-bold">Latest trends</h2>
            <p className="mt-1 text-sm text-slate-500">
              Sorted by publish date across all sources.
            </p>
          </div>
        </div>
        <NewsBrowser initialArticles={articles} initialUpdatedAt={updatedAt} />
      </section>

      <section id="sources" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-14">
        <div className="mb-6">
          <h2 className="text-xl font-bold">Our 10 sources</h2>
          <p className="mt-1 text-sm text-slate-500">
            RSS feeds from the most respected testing and AI-testing blogs.
          </p>
        </div>
        <SourceGrid />
      </section>
    </main>
  );
}
