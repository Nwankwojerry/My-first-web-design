import { NextResponse } from "next/server";
import { listPublishedArticles } from "@/lib/services/article-service";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_SLUG_LENGTH = 100;

function isValidSlug(value: string) {
  return value.length <= MAX_SLUG_LENGTH && SLUG_PATTERN.test(value);
}

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

  const page = parsePositiveInt(searchParams.get("page"), DEFAULT_PAGE);
  const limit = parsePositiveInt(searchParams.get("limit"), DEFAULT_LIMIT);

  if (page === null) return badRequest("Invalid page.");
  if (limit === null || limit > MAX_LIMIT) return badRequest("Invalid limit.");

  const category = searchParams.get("category");
  const tag = searchParams.get("tag");
  const author = searchParams.get("author");

  for (const value of [category, tag, author]) {
    if (value !== null && !isValidSlug(value)) return badRequest("Invalid filter.");
  }

  try {
    const result = await listPublishedArticles({
      page,
      limit,
      categorySlug: category ?? undefined,
      tagSlug: tag ?? undefined,
      authorSlug: author ?? undefined,
    });

    return NextResponse.json({
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
