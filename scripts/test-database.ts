import { config } from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

config({ path: ".env.local" });
config({ path: ".env" });

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not configured.");
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });

async function main() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    const [articles, categories, tags, media] = await Promise.all([
      prisma.article.count(), prisma.category.count(), prisma.tag.count(), prisma.media.count()
    ]);
    console.log(JSON.stringify({ ok: true, articles, categories, tags, media }, null, 2));
  } finally { await prisma.$disconnect(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
