import { PrismaClient } from "../generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://admin:password@localhost:5432/foodpanda",
});

const adapter = new PrismaPg(pool);

const prismaClientSingleton = () => {
  return new PrismaClient({ adapter });
};
const prisma = global.prisma ?? prismaClientSingleton();
if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export const db = prisma;
