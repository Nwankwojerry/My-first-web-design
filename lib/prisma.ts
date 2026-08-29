import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

declare global { var __homestreetPrisma: PrismaClient | undefined; }

export function getPrismaClient(): PrismaClient | null {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return null;
  if (!global.__homestreetPrisma) {
    global.__homestreetPrisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  }
  return global.__homestreetPrisma;
}
