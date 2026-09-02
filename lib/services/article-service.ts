import type { Prisma } from "@/app/generated/prisma/client";
import { getPrismaClient } from "@/lib/prisma";

export interface PaginationInput {
  page: number;
  limit: number;
}

export interface ArticleListFilters extends PaginationInput {
  categorySlug?: string;
  tagSlug?: string;
  authorSlug?: string;
}

export interface ArticleSummary {
  title: string;
  slug: string;
  excerpt: string | null;
  publishedAt: Date | null;
  featured: boolean;
  category: { name: string; slug: string } | null;
  author: { name: string; slug: string; bio: string | null; image: string | null } | null;
  tags: Array<{ name: string; slug: string }>;
  media: Array<{ url: string; altText: string | null; caption: string | null; credit: string | null; sortOrder: number }>;
}

export interface ArticleDetail extends ArticleSummary {
  content: string;
}

export interface ArticleListResult {
  items: ArticleSummary[];
  total: number;
  page: number;
  limit: number;
}

export interface CategoryResult {
  name: string;
  slug: string;
  articles: ArticleListResult;
}

const ARTICLE_RELATIONS = {
  category: true,
  author: true,
  media: { orderBy: { sortOrder: "asc" as const } },
  tags: { include: { tag: true } },
} as const;

type PublicArticleRecord = Prisma.ArticleGetPayload<{ include: typeof ARTICLE_RELATIONS }>;

function requirePrisma() {
  const prisma = getPrismaClient();
  if (!prisma) throw new Error("DATABASE_UNAVAILABLE");
  return prisma;
}

function toArticleSummary(article: PublicArticleRecord): ArticleSummary {
  return {
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    publishedAt: article.publishedAt,
    featured: article.featured,
    category: article.category ? { name: article.category.name, slug: article.category.slug } : null,
    author: article.author ? { name: article.author.name, slug: article.author.slug, bio: article.author.bio, image: article.author.image } : null,
    tags: article.tags.map(({ tag }) => ({ name: tag.name, slug: tag.slug })),
    media: article.media.map((item) => ({ url: item.url, altText: item.altText, caption: item.caption, credit: item.credit, sortOrder: item.sortOrder })),
  };
}

function toArticleDetail(article: PublicArticleRecord): ArticleDetail {
  return { ...toArticleSummary(article), content: article.content };
}

function publishedArticleWhere(filters: Pick<ArticleListFilters, "categorySlug" | "tagSlug" | "authorSlug"> = {}): Prisma.ArticleWhereInput {
  return {
    status: "PUBLISHED",
    publishedAt: { not: null },
    ...(filters.categorySlug ? { category: { slug: filters.categorySlug } } : {}),
    ...(filters.authorSlug ? { author: { slug: filters.authorSlug } } : {}),
    ...(filters.tagSlug ? { tags: { some: { tag: { slug: filters.tagSlug } } } } : {}),
  };
}

function paginationSkip(page: number, limit: number) {
  return (page - 1) * limit;
}

export async function listPublishedArticles(filters: ArticleListFilters): Promise<ArticleListResult> {
  const prisma = requirePrisma();
  const where = publishedArticleWhere(filters);
  const [articles, total] = await prisma.$transaction([
    prisma.article.findMany({ where, include: ARTICLE_RELATIONS, orderBy: [{ publishedAt: "desc" }, { id: "desc" }], skip: paginationSkip(filters.page, filters.limit), take: filters.limit }),
    prisma.article.count({ where }),
  ]);
  return { items: articles.map(toArticleSummary), total, page: filters.page, limit: filters.limit };
}

export async function getPublishedArticleBySlug(slug: string): Promise<ArticleDetail | null> {
  const prisma = requirePrisma();
  const article = await prisma.article.findFirst({
    where: { slug, status: "PUBLISHED", publishedAt: { not: null } },
    include: ARTICLE_RELATIONS,
  });
  return article ? toArticleDetail(article) : null;
}

export async function getPublishedCategory(slug: string, pagination: PaginationInput): Promise<CategoryResult | null> {
  const prisma = requirePrisma();
  const category = await prisma.category.findUnique({ where: { slug }, select: { name: true, slug: true, id: true } });
  if (!category) return null;
  const where: Prisma.ArticleWhereInput = { ...publishedArticleWhere(), categoryId: category.id };
  const [articles, total] = await prisma.$transaction([
    prisma.article.findMany({ where, include: ARTICLE_RELATIONS, orderBy: [{ publishedAt: "desc" }, { id: "desc" }], skip: paginationSkip(pagination.page, pagination.limit), take: pagination.limit }),
    prisma.article.count({ where }),
  ]);
  return { name: category.name, slug: category.slug, articles: { items: articles.map(toArticleSummary), total, page: pagination.page, limit: pagination.limit } };
}

export async function searchPublishedArticles(query: string, pagination: PaginationInput): Promise<ArticleListResult> {
  const prisma = requirePrisma();
  const term = query.trim();
  const where: Prisma.ArticleWhereInput = {
    ...publishedArticleWhere(),
    OR: [
      { title: { contains: term, mode: "insensitive" } },
      { excerpt: { contains: term, mode: "insensitive" } },
      { content: { contains: term, mode: "insensitive" } },
      { category: { name: { contains: term, mode: "insensitive" } } },
      { tags: { some: { tag: { name: { contains: term, mode: "insensitive" } } } } },
    ],
  };
  const [articles, total] = await prisma.$transaction([
    prisma.article.findMany({ where, include: ARTICLE_RELATIONS, orderBy: [{ publishedAt: "desc" }, { id: "desc" }], skip: paginationSkip(pagination.page, pagination.limit), take: pagination.limit }),
    prisma.article.count({ where }),
  ]);
  return { items: articles.map(toArticleSummary), total, page: pagination.page, limit: pagination.limit };
}
