"use server";

import { db } from "@/lib/prisma";

export async function findUserRoles(userId: string) {
  if (!userId) return { success: false, message: "User not found" };
  try {
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
    const userData = {
      ...user,
      // store a primitive to avoid circular JSON/complex objects from Prisma
      selected_role: user?.user_roles?.[0]?.key ?? null,
      roles: user?.user_roles?.map((role) => role.key) ?? [],
      role_id: user?.user_roles?.[0]?.id ?? null,
    };
    return { success: true, data: userData };
  } catch (error) {
    console.error("Error finding user roles:", error);
    return { success: false, message: "Error finding user roles" };
  }
}
