import fs from "node:fs";
import path from "node:path";

export type LegacyPage = { slug: string; title: string; description: string; mainHtml: string };
const ROOT = process.cwd();
const readHtml = (p: string) => fs.readFileSync(path.join(ROOT, p), "utf8");
const decodeHtml = (v: string) => v.replaceAll("&amp;", "&").replaceAll("&quot;", '"').replaceAll("&#39;", "'").replaceAll("&lt;", "<").replaceAll("&gt;", ">");
const extract = (pattern: RegExp, html: string) => html.match(pattern)?.[1]?.trim() ?? "";

export function getLegacySlugs(): string[] {
  return fs.readdirSync(path.join(ROOT, "pages")).filter((e) => e.endsWith(".html")).map((e) => e.replace(/\.html$/, "")).sort();
}

export function getHomePage(): LegacyPage {
  const html = readHtml("index.html");
  return { slug: "", title: decodeHtml(extract(/<title>([\s\S]*?)<\/title>/i, html)), description: decodeHtml(extract(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i, html)), mainHtml: extract(/<main>([\s\S]*?)<\/main>/i, html) };
}

export function getLegacyPage(slug: string): LegacyPage {
  if (!/^[a-z0-9-]+$/.test(slug)) throw new Error("Invalid page slug");
  const html = readHtml(path.join("pages", slug + ".html"));
  return { slug, title: decodeHtml(extract(/<title>([\s\S]*?)<\/title>/i, html)), description: decodeHtml(extract(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i, html)), mainHtml: extract(/<main>([\s\S]*?)<\/main>/i, html) };
}
