"use client";
import { hasRouteAccess } from "@/helpers/route";
import { getSession, useSession } from "@/lib/auth-client";
import { useAuthStore } from "@/store/authStore";
import { redirect, usePathname } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const {
    user,
    userPermissions,
    isLoading,
    loadPermissions,
    setUser,
  } = useAuthStore();

  async function fetchSession() {
    const session = await getSession();
    if (session.data?.user) {
      setUser(session.data?.user);
    } else {
      redirect("/login");
    }
    console.log("getSession test>>", session);
  }

  // hydrate user from session
  useEffect(() => {
    if (session?.user && !user) setUser(session.user);
    else if (!session?.user && !user) {
      console.log("session user not found, refreshing");
      fetchSession();
    } else console.log("sessionuser", { user, session });
  }, [session?.user, user, setUser]);

  // load permissions once we have user
  useEffect(() => {
    if (user?.id && !userPermissions) loadPermissions(user.id);
    else console.log("userPermissions exist", userPermissions, user?.id);
  }, [user?.id, userPermissions, loadPermissions]);

  // strictly block rendering until permissions are present or no route requirements
  useEffect(() => {
    if (!user || !userPermissions) return; // still initializing

    // const routeReqs = getRouteRequirements(pathname);
    const routeReqs = hasRouteAccess(
      pathname,
      userPermissions.permissions,
      user.selected_role
    );
    console.log("routeReqs>>", {
      routeReqs,
      pathname,
      perm: userPermissions.permissions,
      userRole: user.selected_role,
    });

    if (!routeReqs) {
      const route = user?.selected_role
        ? `/${user.selected_role.toLowerCase()}/dashboard`
        : "/customer/dashboard";
      toast.error("You do not have permission to access this page");
      redirect(route);

      // forbidden();
    }
  }, [pathname, user, userPermissions]);

  console.log("route guard check>>", { user, userPermissions, isLoading });

  // unified loading gate to prevent any content flash
  if (!user || isLoading || !userPermissions) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
