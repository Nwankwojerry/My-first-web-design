import { NextResponse } from "next/server";
import { searchPublishedArticles } from "@/lib/services/article-service";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;
const MIN_QUERY_LENGTH = 2;
const MAX_QUERY_LENGTH = 100;

function parsePositiveInt(value: string | null, fallback: number) {
  if (value === null) return fallback;
  if (!/^\d+$/.test(value)) return null;

  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
}

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();

  if (!query || query.length < MIN_QUERY_LENGTH || query.length > MAX_QUERY_LENGTH) {
    return badRequest("Invalid search query.");
  }

  const page = parsePositiveInt(searchParams.get("page"), DEFAULT_PAGE);
  const limit = parsePositiveInt(searchParams.get("limit"), DEFAULT_LIMIT);

  if (page === null) return badRequest("Invalid page.");
  if (limit === null || limit > MAX_LIMIT) return badRequest("Invalid limit.");

  try {
    const result = await searchPublishedArticles(query, { page, limit });

    return NextResponse.json({
      query,
      data: result.items,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.total === 0 ? 0 : Math.ceil(result.total / result.limit),
      },
    });
  } catch {
    return NextResponse.json(
      { error: "An unexpected server error occurred." },
      { status: 500 },
    );
  }
}
