import PermissionCache, { UserPermissions } from "@/lib/permissionCache";
import db from "@/lib/prisma";
import { cache } from "react";

export default class PermissionService {
  private cache = PermissionCache.getInstance();

  // React cache for database calls (deduplication)
  private getCachedUserPermissions = cache(
    async (userId: string): Promise<UserPermissions> => {
      console.log("DB Query for user:", userId); // This should only run once per request

      const user = (await db.user.findUnique({
        where: { id: userId },
        include: {
          user_roles: {
            select: {
              id: true,
              name: true,
              key: true,
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
      })) as any;

      // fetch direct user permissions via user relation (cast to any until prisma types are regenerated)
      const directPermsWrap = (await db.user.findUnique({
        where: { id: userId },
        include: { user_permissions: { select: { key: true } } },
      } as any)) as any;
      const directPerms = (directPermsWrap?.user_permissions ?? []) as Array<{
        key: string;
      }>;

      if (!user) {
        throw new Error("User not found");
      }

      // Convert to optimized format
      const rolePermissions = new Map<string, Set<string>>();

      user.user_roles.forEach((ur: any) => {
        const roleKey = ur.key ?? ur.name;
        const rolePermissionsSet = new Set<string>();
        ur.role_permissions.forEach((rp: any) => {
          const permissionKey = `${rp.key}`;
          rolePermissionsSet.add(permissionKey);
        });
        rolePermissions.set(roleKey, rolePermissionsSet);
      });

      // Build final permission set: union across ALL roles + direct user grants
      const base = new Set<string>();
      for (const [, set] of rolePermissions) {
        for (const p of set) base.add(p);
      }
      for (const up of directPerms) base.add(up.key);

      return {
        userId: user.id,
        roleId: user.user_roles[0]?.id,
        roleName: user.user_roles[0]?.key ?? user.user_roles[0]?.name,
        permissions: base,
        allRolePermissions: rolePermissions,
        lastUpdated: new Date(),
      };
    }
  );

  // Main method to get user permissions with caching
  async getUserPermissions(userId: string): Promise<UserPermissions> {
    // Try memory cache first
    let permissions = this.cache.get(userId);

    if (permissions) {
      console.log("Cache HIT for user:", userId);
      return permissions;
    }

    console.log("Cache MISS for user:", userId);

    // Get from database with React cache
    permissions = await this.getCachedUserPermissions(userId);

    // Store in memory cache
    this.cache.set(userId, permissions);

    return permissions;
  }

  // Force refresh permissions for a user (re-fetch + update memory cache)
  async refreshUserPermissions(userId: string): Promise<UserPermissions> {
    const freshPermissions = await this.getCachedUserPermissions(userId);
    this.cache.set(userId, freshPermissions);
    return freshPermissions;
  }

  // Invalidate cache when permissions change
  async invalidateUserPermissions(userId: string): Promise<void> {
    this.cache.delete(userId);
    console.log("Invalidated cache for user:", userId);
  }

  // Invalidate all users with a specific role
  async invalidateRolePermissions(roleId: string): Promise<void> {
    console.log("Invalidating cache for role:", roleId);
    // Get all users with this role
    const users = await db.user.findMany({
      where: { user_roles: { some: { id: roleId } } },
      select: { id: true },
    });

    // Invalidate each user's cache
    users.forEach((user) => {
      this.cache.delete(user.id);
    });

    console.log(
      `Invalidated cache for ${users.length} users with role:`,
      roleId
    );
  }

  // Clear all caches (when permission structure changes)
  async clearAllCaches(): Promise<void> {
    this.cache.clear();
    console.log("Cleared all permission caches");
  }
}
