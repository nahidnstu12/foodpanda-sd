import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    // requireEmailVerification: false,
  },
  user: {
    additionalFields: {
      status: {
        type: "string",
        defaultValue: "INACTIVE",
      },
      is_phone_verified: {
        type: "boolean", 
        defaultValue: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      deleted_at: {
        type: "date",
        required: false,
      },
      // user_type: {
      //   type: "string",
      //   required: false,
      // },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 1, // 1 days
  },
  logger: {
    disabled: false,
    level: "error",
    log: (level, message, ...args) => {
      console.log(`[${level}] ${message}`, ...args);
    },
  },
  // logger: {
  //   disabled: false,
  //   level: "info",
  // },
});
