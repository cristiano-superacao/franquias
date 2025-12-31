import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const url = process.env.RAILWAY_DATABASE_URL || process.env.DATABASE_URL;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["error"],
    ...(url ? { datasourceUrl: url } : {}),
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
