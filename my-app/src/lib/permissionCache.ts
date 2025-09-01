export interface UserPermissions {
    userId: string;
    roleId: string;
    roleName: string;
    roleHierarchy: number;
    permissions: Set<string>; // Current role permissions only
    allRolePermissions: Map<string, Set<string>>; // All roles with their permissions
    lastUpdated: Date;
  }
export default class PermissionCache {
  private static instance: PermissionCache;
  private cache = new Map<string, UserPermissions>();
  private readonly TTL = 15 * 60 * 1000; // 15 minutes in milliseconds

  static getInstance(): PermissionCache {
    if (!PermissionCache.instance) {
      PermissionCache.instance = new PermissionCache();
    }
    return PermissionCache.instance;
  }

  // Get from memory cache
  get(userId: string): UserPermissions | null {
    const cached = this.cache.get(userId);

    if (!cached) return null;

    // Check if cache is expired
    if (Date.now() - cached.lastUpdated.getTime() > this.TTL) {
      this.cache.delete(userId);
      return null;
    }

    return cached;
  }

  // Set in memory cache
  set(userId: string, permissions: UserPermissions): void {
    this.cache.set(userId, {
      ...permissions,
      lastUpdated: new Date(),
    });
  }

  // Delete from cache (for permission updates)
  delete(userId: string): void {
    this.cache.delete(userId);
  }

  // Clear entire cache (for role/permission structure changes)
  clear(): void {
    this.cache.clear();
  }

  // Get cache stats
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}
