import { getUserPermissions } from '@/actions/permissions';
import { UserPermissions } from '@/lib/permissionCache';
import { create } from 'zustand';

interface AuthStore {
  user: any | null;
  permissions: UserPermissions | null;
  isLoading: boolean;

  // Actions
  setUser: (user: any) => void;
  loadPermissions: (userId: string) => Promise<void>;
  clearAuth: () => void;

  // Permission helpers
  can: (permission: string) => boolean;
  canAny: (permissions: string[]) => boolean;
  canAll: (permissions: string[]) => boolean;
  hasRole: (roleName: string) => boolean;
  hasMinHierarchy: (minHierarchy: number) => boolean; // remove later
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  permissions: null,
  isLoading: false,

  setUser: (user) => set({ user }),

  loadPermissions: async (userId) => {
    set({ isLoading: true });
    try {
      const permissions = await getUserPermissions(userId);
      set({ permissions, isLoading: false });
    } catch (error) {
      console.error('Failed to load permissions:', error);
      set({ permissions: null, isLoading: false });
    }
  },

  clearAuth: () => set({ user: null, permissions: null }),

  // Check single permission: "users:create"
  can: (permission) => {
    const { permissions } = get();
    return permissions?.permissions.has(permission) ?? false;
  },

  // Check if user has ANY of the permissions
  canAny: (permissionList) => {
    const { permissions } = get();
    if (!permissions) return false;

    return permissionList.some((perm) => permissions.permissions.has(perm));
  },

  // Check if user has ALL permissions
  canAll: (permissionList) => {
    const { permissions } = get();
    if (!permissions) return false;

    return permissionList.every((perm) => permissions.permissions.has(perm));
  },

  // Check exact role
  hasRole: (roleName) => {
    const { permissions } = get();
    return permissions?.roleName === roleName;
  },

  // Check role hierarchy (admin can access rider pages)
  hasMinHierarchy: (minHierarchy) => {
    const { permissions } = get();
    return (permissions?.roleHierarchy ?? 0) >= minHierarchy;
  },
}));
