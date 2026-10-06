import Parser from "rss-parser";
import { SOURCES, SOURCE_MAP } from "./sources";

const parser = new Parser({
  timeout: 12000,
  headers: {
    "User-Agent": "Mozilla/5.0 (compatible; TestingTrends/1.0; +https://github.com)",
    Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml",
  },
});

const CACHE_TTL = 1000 * 60 * 30;
let cache = { data: null, at: 0 };

const AI_KEYWORDS =
  /\b(ai|a\.i\.|artificial intelligence|machine learning|\bml\b|llm|gpt|chatgpt|genai|generative|copilot|neural|deep learning|agentic|self-healing|computer vision)\b/i;

function stripHtml(html = "") {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function extractImage(item) {
  if (item.enclosure?.url && /^https?:/.test(item.enclosure.url)) return item.enclosure.url;
  const media = item["media:content"]?.$?.url || item["media:thumbnail"]?.$?.url;
  if (media) return media;
  if (item.itunes?.image) return item.itunes.image;
  const html = item.content || item["content:encoded"] || "";
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (match && /^https?:/.test(match[1])) return match[1];
  return null;
}

function excerptOf(item) {
  const raw = item.contentSnippet || item.content || item.summary || item.description || "";
  const text = stripHtml(raw);
  if (text.length > 260) return text.slice(0, 257).replace(/\s+\S*$/, "") + "...";
  return text;
}

function categorize(source, title, excerpt) {
  const text = `${title} ${excerpt}`;
  const isAi = AI_KEYWORDS.test(text);
  const sourceIsAiOnly =
    source.categories.length === 1 && source.categories[0] === "ai-testing";
  if (isAi || sourceIsAiOnly) return "ai-testing";
  if (source.categories.includes("ai-testing") && isAi) return "ai-testing";
  return "software-testing";
}

async function fetchSource(source) {
  try {
    const feed = await parser.parseURL(source.feedUrl);
    return (feed.items || []).slice(0, 40).map((item) => {
      const title = stripHtml(item.title || "Untitled");
      const excerpt = excerptOf(item);
      const link = item.link || item.guid || source.homepage;
      const date = item.isoDate || item.pubDate || null;
      return {
        id: Buffer.from(`${source.id}:${link}`).toString("base64url"),
        title,
        link,
        date,
        excerpt,
        image: extractImage(item),
        category: categorize(source, title, excerpt),
        source: { id: source.id, name: source.name, homepage: source.homepage },
      };
    });
  } catch (err) {
    console.error(`[news] failed to fetch ${source.name}: ${err.message}`);
    return [];
  }
}

export async function getAllNews(force = false) {
  if (!force && cache.data && Date.now() - cache.at < CACHE_TTL) return cache.data;

  const results = await Promise.all(SOURCES.map(fetchSource));
  const articles = results
    .flat()
    .filter((a) => a.title && a.link)
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

  cache = { data: articles, at: Date.now() };
  return articles;
}

export function filterNews(articles, { category = "all", source = "", q = "" } = {}) {
  let out = articles;
  if (category && category !== "all") out = out.filter((a) => a.category === category);
  if (source) out = out.filter((a) => a.source.id === source);
  if (q) {
    const needle = q.toLowerCase();
    out = out.filter(
      (a) =>
        a.title.toLowerCase().includes(needle) ||
        a.excerpt.toLowerCase().includes(needle) ||
        a.source.name.toLowerCase().includes(needle)
    );
  }
  return out;
}

export function getSources() {
  return SOURCES.map((s) => ({ ...s, exists: Boolean(SOURCE_MAP[s.id]) }));
}
