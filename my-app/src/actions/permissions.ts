"use server";

import PermissionCache, { UserPermissions } from "@/lib/permissionCache";
import db from "@/lib/prisma";

const permissionCache = PermissionCache.getInstance();

export async function getUserPermissions(
  userId: string
): Promise<UserPermissions> {
  // Try memory cache first
  let permissions = permissionCache.get(userId);

  if (permissions) {
    console.log("Cache HIT for user:", userId);
    return permissions;
  }

  console.log("Cache MISS for user:", userId);

  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      user_roles: {
        select: {
          id: true,
          name: true,
          role_permissions: {
            select: {
              key: true,
              name: true,
              description: true,
              group: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Convert to optimized format
  const permissionsSet = new Set<string>();
  const rolePermissions = new Map<string, Set<string>>();

  user.user_roles.forEach((ur) => {
    const rolePermissionsSet = new Set<string>();
    ur.role_permissions.forEach((rp) => {
      const permissionKey = `${rp.key}:${rp.name}`;
      rolePermissionsSet.add(permissionKey);
    });
    rolePermissions.set(ur.name, rolePermissionsSet);
  });

  permissions = {
    userId: user.id,
    roleId: user.user_roles[0].id,
    roleName: user.user_roles[0].name,
    roleHierarchy: 100,
    permissions: rolePermissions.get(user.user_roles[0].name) || new Set(),
    allRolePermissions: rolePermissions,
    lastUpdated: new Date(),
  };

  // Store in memory cache
  permissionCache.set(userId, permissions);

  return permissions;
}

export async function invalidateUserPermissions(userId: string): Promise<void> {
  permissionCache.delete(userId);
  console.log("Invalidated cache for user:", userId);
}
