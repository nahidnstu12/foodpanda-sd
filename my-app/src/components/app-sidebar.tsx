"use client";

import { GalleryVerticalEnd } from "lucide-react";

import { NavMenu } from "@/components/nav-menu";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/store/authStore";
import { useMenuStore } from "@/store/menuStore";
import { useEffect } from "react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, userPermissions } = useAuthStore();
  const filteredMenu = useMenuStore((s) => s.filteredMenu);
  const setUserPermissions = useMenuStore((s) => s.setUserPermissions);

  useEffect(() => {
    if (userPermissions?.permissions) {
      setUserPermissions(userPermissions.permissions); // pass the Set<string>
    }
  }, [userPermissions?.permissions, setUserPermissions]);

  const data = {
    org: {
      name: "Quick Serve",
      logo: GalleryVerticalEnd,
      plan: userPermissions?.roleName || user?.roles?.[0] || "User",
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
        <NavMenu items={filteredMenu} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
