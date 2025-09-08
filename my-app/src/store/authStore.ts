import { getUserPermissions } from '@/actions/permissions';
import { UserPermissions } from '@/lib/permissionCache';
import { create } from 'zustand';
import { useMenuStore } from '@/store/menuStore';

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
    const prev = get();
    const hasUserId = Boolean(user?.id);
    const isSameUser = prev.user?.id && user?.id && prev.user?.id === user?.id;
    const permissionsLoadedForSameUser =
      Boolean(prev.userPermissions) && Boolean(isSameUser);

    // If user switched, drop old permissions to avoid stale access
    const shouldResetPermissions = hasUserId && !isSameUser;

    console.log('setUser', {
      hasUserId,
      isSameUser,
      permissionsLoadedForSameUser,
    });

    set({
      user,
      userPermissions: shouldResetPermissions ? null : prev.userPermissions,
      // Only show loading when we have a user but permissions aren't ready for this user
      isLoading: hasUserId && !permissionsLoadedForSameUser ? true : false,
    });
  },

  loadPermissions: async (userId) => {
    set({ isLoading: true });
    try {
      const permissions = await getUserPermissions(userId);
      console.log('loadPermissions', !!permissions);
      set({ userPermissions: permissions, isLoading: false });
    } catch (error) {
      console.error('Failed to load permissions:', error);
      set({ userPermissions: null, isLoading: false });
    }
  },

  // Also clear the menu to prevent previous-role menu flash
  clearAuth: () => {
    set({ user: null, userPermissions: null, isLoading: false });
    try {
      useMenuStore.getState().reset();
      console.log('clearing auth');
    } catch {
      console.log('error clearing auth');
    }
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
