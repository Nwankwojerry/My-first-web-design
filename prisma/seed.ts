import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is required to seed Homestreet.");
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });
const root = process.cwd();
const read = (name: string) => fs.readFileSync(path.join(root, "pages", name), "utf8");
const first = (re: RegExp, html: string) => html.match(re)?.[1]?.trim() ?? "";
const all = (re: RegExp, html: string) => [...html.matchAll(re)].map(m => m[1]?.trim() ?? "");
const decode = (s: string) => s.replaceAll("&amp;", "&").replaceAll("&quot;", '"').replaceAll("&#39;", "'").replaceAll("&lt;", "<").replaceAll("&gt;", ">");
const slugify = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9\s-]/g, "").trim().replace(/[\s-]+/g, "-");

function parse(file: string) {
  const html = read(file);
  const title = decode(first(/<article class="article-main">[\s\S]*?<h1>([\s\S]*?)<\/h1>/i, html));
  const excerpt = decode(first(/<p class="article-deck">([\s\S]*?)<\/p>/i, html));
  const category = decode(first(/<div class="article-meta">[\s\S]*?<span>([^<]+)<\/span>/i, html));
  const published = first(/<time datetime="([^"]+)"/i, html);
  const body = first(/<div class="article-body">([\s\S]*?)<\/div>/i, html).replace(/<div class="article-tags">[\s\S]*?<\/div>/i, "").trim();
  const tags = [...new Set(all(/<span class="article-tag">([\s\S]*?)<\/span>/gi, html).map(decode))];
  const media = all(/<figure class="article-figure">([\s\S]*?)<\/figure>/gi, html).map((figure, i) => ({
    url: first(/<img[^>]+src="([^"]+)"/i, figure).replace(/^\.\.\//, "/"),
    altText: decode(first(/<img[^>]+alt="([^"]*)"/i, figure)),
    caption: decode(first(/<figcaption>([\s\S]*?)<\/figcaption>/i, figure)) || null,
    sortOrder: i,
  }));
  if (!title || !body) throw new Error(`Could not parse ${file}`);
  return { slug: file.replace(/\.html$/, ""), title, excerpt: excerpt || null, category: category || null, publishedAt: published ? new Date(published) : null, content: body, tags, media };
}

async function main() {
  const files = fs.readdirSync(path.join(root, "pages")).filter(f => f.endsWith(".html") && /class="article-body"/i.test(read(f)));
  for (const item of files.map(parse)) {
    const category = item.category ? await prisma.category.upsert({ where: { slug: slugify(item.category) }, update: { name: item.category }, create: { name: item.category, slug: slugify(item.category) } }) : null;
    await prisma.article.deleteMany({ where: { slug: item.slug } });
    const tagLinks = [];
    for (const name of item.tags) {
      const tag = await prisma.tag.upsert({ where: { slug: slugify(name) }, update: { name }, create: { name, slug: slugify(name) } });
      tagLinks.push({ tagId: tag.id });
    }
    await prisma.article.create({ data: { slug: item.slug, title: item.title, excerpt: item.excerpt, content: item.content, status: "PUBLISHED", publishedAt: item.publishedAt, featured: item.slug === "feature-ai", categoryId: category?.id ?? null, tags: { create: tagLinks }, media: { create: item.media } } });
    console.log(`Seeded ${item.slug}`);
  }
  console.log(`Seed complete: ${await prisma.article.count()} articles`);
}

main().catch(e => { console.error(e); process.exitCode = 1; }).finally(() => prisma.$disconnect());
