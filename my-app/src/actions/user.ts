"use server";

import db from "@/lib/prisma";

export async function findUserRoles(userId: string) {
  if (!userId) return { success: false, message: "User not found" };
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      user_roles: true,
      customer_profile: true,
      rider_profile: true,
      partner_profile: true,
      admin_profile: true,
    },
  });
  return { success: true, data: user };
}
