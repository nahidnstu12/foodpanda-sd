import { create } from "zustand";
import { allMenus, getMenusByRole } from "@/config/menus";
import { useAuthStore } from "./authStore";

interface MenuState {
  userPermissions: Set<string>;
  filteredMenu: any[];
  setUserPermissions: (permissions: Set<string>) => void;
  getFilteredMenu: () => any[];
  reset: () => void;
}

export const useMenuStore = create<MenuState>((set, get) => ({
  userPermissions: new Set(),
  filteredMenu: [],

  setUserPermissions: (permissions) => {
    const permSet = Array.isArray(permissions)
      ? new Set(permissions)
      : permissions;
    set({ userPermissions: permSet });
    get().getFilteredMenu();
  },

  getFilteredMenu: () => {
    const { userPermissions } = get();

    const filterMenu = (items: any[]): any[] =>
      items
        .filter((item) =>
          item.permissions?.every((p: string) => userPermissions.has(p))
        )
        .map((item) => {
          if (item.items) {
            const children = filterMenu(item.items);
            return children.length ? { ...item, items: children } : null;
          }
          return item;
        })
        .filter(Boolean) as any[];

    const role = useAuthStore.getState().user?.selected_role;
    const filtered = filterMenu(getMenusByRole(role));
    set({ filteredMenu: filtered });
    return filtered;
  },
  reset: () => set({ userPermissions: new Set(), filteredMenu: [] }),
}));
