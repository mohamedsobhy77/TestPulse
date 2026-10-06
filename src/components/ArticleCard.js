"use client";

import { useState } from "react";

const CATEGORY_STYLES = {
  "software-testing": "bg-cyan-500/15 text-cyan-300 border-cyan-400/30",
  "ai-testing": "bg-violet-500/15 text-violet-300 border-violet-400/30",
};

const CATEGORY_LABELS = {
  "software-testing": "Software Testing",
  "ai-testing": "AI Testing",
};

function timeAgo(date) {
  if (!date) return "";
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ArticleCard({ article }) {
  const [imageFailed, setImageFailed] = useState(false);
  const pill = CATEGORY_STYLES[article.category] || CATEGORY_STYLES["software-testing"];
  const label = CATEGORY_LABELS[article.category] || "Software Testing";

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0c111f] transition-colors hover:border-sky-400/40">
      <a
        href={article.link}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block aspect-video overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900"
      >
        {article.image && !imageFailed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.image}
            alt=""
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-4xl font-black text-white/10">
              {article.source.name.slice(0, 2).toUpperCase()}
            </span>
          </div>
        )}
        <span
          className={`absolute left-3 top-3 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold backdrop-blur ${pill}`}
        >
          {label}
        </span>
      </a>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <a
            href={article.source.homepage}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-slate-400 transition-colors hover:text-sky-400"
          >
            {article.source.name}
          </a>
          <span>{timeAgo(article.date)}</span>
        </div>

        <h3 className="text-base font-semibold leading-6 text-slate-100">
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors group-hover:text-sky-300"
          >
            {article.title}
          </a>
        </h3>

        {article.excerpt ? (
          <p className="line-clamp-3 text-sm leading-6 text-slate-400">
            {article.excerpt}
          </p>
        ) : null}

        <a
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto pt-1 text-xs font-semibold text-sky-400 opacity-0 transition-opacity group-hover:opacity-100"
        >
          Read article &rarr;
        </a>
      </div>
    </article>
  );
}
