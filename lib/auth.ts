import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { getPrismaClient } from "@/lib/prisma";

const prisma = getPrismaClient();

if (!prisma) {
  throw new Error("DATABASE_URL is required for Better Auth configuration.");
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    database: {
      generateId: "serial",
    },
  },
});
