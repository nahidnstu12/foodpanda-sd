import { PrismaClient } from "../generated/prisma/index.js";

const prismaClientSingleton = () => {
  return new PrismaClient();
};
const prisma = global.prisma ?? prismaClientSingleton();
if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export const db = prisma;
