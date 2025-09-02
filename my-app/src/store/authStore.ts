import { getUserPermissions } from "@/actions/permissions";
import { UserPermissions } from "@/lib/permissionCache";
import { create } from "zustand";
import { useMenuStore } from "@/store/menuStore"; // add back

interface AuthStore {
  user: any | null;
  userPermissions: UserPermissions | null;
  isLoading: boolean;
  setUser: (user: any) => void;
  loadPermissions: (userId: string) => Promise<void>;
  clearAuth: () => void;
  can: (permission: string) => boolean;
  canAny: (permissions: string[]) => boolean;
  canAll: (permissions: string[]) => boolean;
  hasRole: (roleName: string) => boolean;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  userPermissions: null,
  isLoading: false,

  // IMPORTANT: mark loading as soon as we know we have a user but no permissions yet
  setUser: (user) => {
    const hasUserId = Boolean(user?.id);
    set({
      user,
      isLoading: hasUserId ? true : false,
      // don't wipe userPermissions here; let loadPermissions overwrite it
    });
  },

  loadPermissions: async (userId) => {
    set({ isLoading: true });
    try {
      const permissions = await getUserPermissions(userId);
      set({ userPermissions: permissions, isLoading: false });
    } catch (error) {
      console.error("Failed to load permissions:", error);
      set({ userPermissions: null, isLoading: false });
    }
  },

  // Also clear the menu to prevent previous-role menu flash
  clearAuth: () => {
    set({ user: null, userPermissions: null, isLoading: false });
    try {
      useMenuStore.getState().reset();
    } catch {}
  },

  can: (permission) =>
    get().userPermissions?.permissions.has(permission) ?? false,
  canAny: (list) => {
    const perms = get().userPermissions?.permissions;
    if (!perms) return false;
    return list.some((p) => perms.has(p));
  },
  canAll: (list) => {
    const perms = get().userPermissions?.permissions;
    if (!perms) return false;
    return list.every((p) => perms.has(p));
  },
  hasRole: (roleName) => get().userPermissions?.roleName === roleName,
}));
