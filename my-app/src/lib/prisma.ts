import { PrismaClient } from "@generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://admin:password@localhost:5432/foodpanda",
});

const adapter = new PrismaPg(pool);

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prismaClientSingleton = () => {
  return new PrismaClient({ adapter });
};
const prisma = globalThis.prisma ?? prismaClientSingleton();
if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

export const db = prisma;
