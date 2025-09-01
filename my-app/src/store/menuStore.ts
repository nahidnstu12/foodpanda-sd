import { create } from 'zustand';
import { allMenus } from '@/config/menus';

interface MenuState {
  userPermissions: Set<string>;
  filteredMenu: any[];
  setUserPermissions: (permissions: Set<string>) => void;
  getFilteredMenu: () => any[];
}

export const useMenuStore = create<MenuState>((set, get) => ({
  userPermissions: new Set(),
  filteredMenu: [],
  
  setUserPermissions: (permissions: Set<string>) => {
    set({ userPermissions: permissions });
    get().getFilteredMenu();
  },
  
  getFilteredMenu: () => {
    const { userPermissions } = get();
    
    const filterMenu = (items: any[]): any[] => {
      return items
        .filter(item => {
          // Check if user has ALL required permissions for this item
          const hasPermission = item.permissions.every((perm: string) => 
            userPermissions.has(perm)
          );
          return hasPermission;
        })
        .map(item => {
          if (item.items) {
            const filteredChildren = filterMenu(item.items);
            return filteredChildren.length > 0 
              ? { ...item, items: filteredChildren }
              : null;
          }
          return item;
        })
        .filter(Boolean);
    };
    
    const filtered = filterMenu(allMenus);
    set({ filteredMenu: filtered });
    return filtered;
  }
}));