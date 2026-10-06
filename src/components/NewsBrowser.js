"use client";

import { useEffect, useMemo, useState } from "react";
import ArticleCard from "./ArticleCard";
import { CATEGORIES, SOURCES } from "@/lib/sources";

const PAGE_SIZE = 12;

export default function NewsBrowser({ initialArticles = [], initialUpdatedAt = null }) {
  const [articles, setArticles] = useState(initialArticles);
  const [updatedAt, setUpdatedAt] = useState(initialUpdatedAt);
  const [category, setCategory] = useState("all");
  const [sourceId, setSourceId] = useState("");
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (articles.length === 0) {
      loadNews(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadNews(refresh) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/news?refresh=${refresh ? 1 : 0}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const data = await res.json();
      setArticles(data.articles || []);
      setUpdatedAt(data.updatedAt || new Date().toISOString());
    } catch (err) {
      setError(err.message || "Could not load news");
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    let out = articles;
    if (category !== "all") out = out.filter((a) => a.category === category);
    if (sourceId) out = out.filter((a) => a.source.id === sourceId);
    if (query.trim()) {
      const needle = query.trim().toLowerCase();
      out = out.filter(
        (a) =>
          a.title.toLowerCase().includes(needle) ||
          a.excerpt.toLowerCase().includes(needle) ||
          a.source.name.toLowerCase().includes(needle)
      );
    }
    return out;
  }, [articles, category, sourceId, query]);

  const counts = useMemo(() => {
    const bySource = {};
    const byCategory = { all: articles.length, "software-testing": 0, "ai-testing": 0 };
    for (const a of articles) {
      byCategory[a.category] = (byCategory[a.category] || 0) + 1;
      bySource[a.source.id] = (bySource[a.source.id] || 0) + 1;
    }
    return { bySource, byCategory };
  }, [articles]);

  const shown = filtered.slice(0, visible);

  function selectCategory(id) {
    setCategory(id);
    setVisible(PAGE_SIZE);
  }

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {Object.values(CATEGORIES).map((cat) => {
            const active = category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => selectCategory(cat.id)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "border-sky-400/60 bg-sky-500/15 text-sky-300"
                    : "border-white/10 bg-white/5 text-slate-400 hover:border-white/25 hover:text-slate-200"
                }`}
              >
                {cat.label}
                <span className="ml-2 text-xs opacity-70">
                  {counts.byCategory[cat.id] ?? 0}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setVisible(PAGE_SIZE);
              }}
              placeholder="Search titles, sources, topics..."
              className="w-full rounded-lg border border-white/10 bg-[#0c111f] px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:border-sky-400/50 focus:outline-none"
            />
          </div>

          <select
            value={sourceId}
            onChange={(e) => {
              setSourceId(e.target.value);
              setVisible(PAGE_SIZE);
            }}
            className="rounded-lg border border-white/10 bg-[#0c111f] px-3 py-2.5 text-sm text-slate-300 focus:border-sky-400/50 focus:outline-none"
          >
            <option value="">All 10 sources</option>
            {SOURCES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({counts.bySource[s.id] || 0})
              </option>
            ))}
          </select>

          <button
            onClick={() => loadNews(true)}
            disabled={loading}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:border-sky-400/50 hover:text-white disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh feeds"}
          </button>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing {shown.length} of {filtered.length} articles
            {category !== "all" ? ` in ${CATEGORIES[category].label}` : ""}
          </span>
          {updatedAt ? (
            <span>
              Updated{" "}
              {new Date(updatedAt).toLocaleString(undefined, {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          ) : null}
        </div>
      </div>

      {error ? (
        <div className="mt-6 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error} — try refreshing the feeds.
        </div>
      ) : null}

      {!error && filtered.length === 0 && !loading ? (
        <div className="mt-6 rounded-lg border border-white/10 bg-[#0c111f] px-4 py-10 text-center text-sm text-slate-400">
          No articles match your filters.
        </div>
      ) : null}

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      {visible < filtered.length ? (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="rounded-full border border-white/15 bg-white/5 px-6 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:border-sky-400/50 hover:text-white"
          >
            Load more articles ({filtered.length - visible} remaining)
          </button>
        </div>
      ) : null}
    </div>
  );
}
