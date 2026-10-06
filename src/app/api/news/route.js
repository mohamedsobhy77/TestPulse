import { NextResponse } from "next/server";
import { getAllNews, filterNews } from "@/lib/news";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || "all";
  const source = searchParams.get("source") || "";
  const q = searchParams.get("q") || "";
  const refresh = searchParams.get("refresh") === "1";

  try {
    const articles = await getAllNews(refresh);
    const results = filterNews(articles, { category, source, q });
    return NextResponse.json({
      ok: true,
      count: results.length,
      total: articles.length,
      updatedAt: new Date().toISOString(),
      articles: results,
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
