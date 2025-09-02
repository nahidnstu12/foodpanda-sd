'use client';

import { GalleryVerticalEnd } from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { useAuthStore } from '@/store/authStore';
import { useMenuStore } from '@/store/menuStore';
import { useEffect } from 'react';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, permissions } = useAuthStore();
  const { setUserPermissions, filteredMenu } = useMenuStore();

  console.log('app sidebar user>>', user);
  console.log('app sidebar permissions>>', permissions);
  console.log('app sidebar filteredMenu>>', filteredMenu);

  useEffect(() => {
    if (permissions?.permissions) {
      // Extract key part from permission strings like "view_orders:View Orders"
      const permissionKeys = Array.from(permissions.permissions).map(
        (perm) => perm.split(':')[0]
      );
      const permissionSet = new Set(permissionKeys);
      console.log('Setting menu permissions>>', permissionSet);
      setUserPermissions(permissionSet);
    }
  }, [permissions?.permissions, setUserPermissions]);

  const data = {
    org: {
      name: 'FoodPanda',
      logo: GalleryVerticalEnd,
      plan: permissions?.roleName || user?.roles?.[0] || 'User',
    },
  };
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <data.org.logo className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{data.org.name}</span>
            <span className="truncate text-xs">{data.org.plan}</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredMenu} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
