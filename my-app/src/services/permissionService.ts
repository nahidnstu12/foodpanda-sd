import db from '@/lib/prisma';
import { cache } from 'react';

export default class PermissionService {
  private cache = PermissionCache.getInstance();

  // React cache for database calls (deduplication)
  private getCachedUserPermissions = cache(
    async (userId: string): Promise<UserPermissions> => {
      console.log('DB Query for user:', userId); // This should only run once per request

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
        throw new Error('User not found');
      }

      // Convert to optimized format
      const permissions = new Set<string>();
      const rolePermissions = new Map<string, Set<string>>();


      user.user_roles.forEach((ur) => {
        const rolePermissionsSet = new Set<string>();
        ur.role_permissions.forEach((rp) => {
          const permissionKey = `${rp.key}:${rp.name}`;
          rolePermissionsSet.add(permissionKey);
        });
        rolePermissions.set(ur.name, rolePermissionsSet);
      });

      return {
        userId: user.id,
        roleId: user.user_roles[0].id,
        roleName: user.user_roles[0].name,
        roleHierarchy: 100,
        permissions: rolePermissions.get(user.user_roles[0].name) || new Set(), // Only current role permissions
        allRolePermissions: rolePermissions, // All roles with their permissions
        lastUpdated: new Date(),
      };
    }
  );

  // Main method to get user permissions with caching
  async getUserPermissions(userId: string): Promise<UserPermissions> {
    // Try memory cache first
    let permissions = this.cache.get(userId);

    if (permissions) {
      console.log('Cache HIT for user:', userId);
      return permissions;
    }

    console.log('Cache MISS for user:', userId);

    // Get from database with React cache
    permissions = await this.getCachedUserPermissions(userId);

    // Store in memory cache
    this.cache.set(userId, permissions);

    return permissions;
  }

  // Invalidate cache when permissions change
  async invalidateUserPermissions(userId: string): Promise<void> {
    this.cache.delete(userId);
    console.log('Invalidated cache for user:', userId);
  }

  // Invalidate all users with a specific role
  async invalidateRolePermissions(roleId: string): Promise<void> {
    console.log('Invalidating cache for role:', roleId);
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
    console.log('Cleared all permission caches');
  }
}
