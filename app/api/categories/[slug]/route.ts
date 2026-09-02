import { NextResponse } from "next/server";
import { getPublishedCategory } from "@/lib/services/article-service";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_SLUG_LENGTH = 100;

function isValidSlug(slug: string) {
  return slug.length > 0 && slug.length <= MAX_SLUG_LENGTH && SLUG_PATTERN.test(slug);
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

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(request: Request, { params }: RouteContext) {
  const { slug } = await params;
  const { searchParams } = new URL(request.url);

  if (!isValidSlug(slug)) {
    return badRequest("Invalid slug.");
  }

  const page = parsePositiveInt(searchParams.get("page"), DEFAULT_PAGE);
  const limit = parsePositiveInt(searchParams.get("limit"), DEFAULT_LIMIT);

  if (page === null) {
    return badRequest("Invalid page.");
  }

  if (limit === null || limit > MAX_LIMIT) {
    return badRequest("Invalid limit.");
  }

  try {
    const category = await getPublishedCategory(slug, { page, limit });

    if (!category) {
      return NextResponse.json({ error: "Category not found." }, { status: 404 });
    }

    return NextResponse.json({
      data: {
        name: category.name,
        slug: category.slug,
        articles: category.articles.items,
      },
      pagination: {
        page: category.articles.page,
        limit: category.articles.limit,
        total: category.articles.total,
        totalPages:
          category.articles.total === 0
            ? 0
            : Math.ceil(category.articles.total / category.articles.limit),
      },
    });
  } catch {
    return NextResponse.json(
      { error: "An unexpected server error occurred." },
      { status: 500 },
    );
  }
}
