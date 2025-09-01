"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { getRouteRequirements } from "@/helpers/route";
import { useSession } from "@/lib/auth-client";

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const {
    user,
    permissions,
    isLoading,
    loadPermissions,
    canAll,
    hasMinHierarchy,
    setUser,
  } = useAuthStore();

  useEffect(() => {
    if (session?.user && !user) {
      setUser(session.user);
    }
  }, [session?.user, user, setUser]);

  useEffect(() => {
    if (user?.id && !permissions) {
      loadPermissions(user.id);
    }
  }, [user?.id, permissions, loadPermissions]);

  useEffect(() => {
    if (isLoading || !user || !permissions) return;

    const routeReqs = getRouteRequirements(pathname);
    if (!routeReqs) return;

    // Check permissions
    if (routeReqs.permissions && !canAll(routeReqs.permissions)) {
      router.push("/unauthorized");
      return;
    }

    // Check hierarchy
    if (routeReqs.minHierarchy && !hasMinHierarchy(routeReqs.minHierarchy)) {
      router.push("/unauthorized");
      return;
    }
  }, [pathname, user, permissions, isLoading, canAll, hasMinHierarchy, router]);

  // Loading state
  if (isLoading || (user && !permissions)) {
    return <div>Loading permissions...</div>;
  }

  return <>{children}</>;
}