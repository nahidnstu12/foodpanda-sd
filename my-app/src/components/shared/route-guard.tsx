"use client";
import { getRouteRequirements, hasRouteAccess } from "@/helpers/route";
import { getSession, useSession } from "@/lib/auth-client";
import { useAuthStore } from "@/store/authStore";
import { forbidden, redirect, usePathname } from "next/navigation";
import { useEffect } from "react";

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const {
    user,
    userPermissions,
    isLoading,
    loadPermissions,
    setUser,
    canAll,
    canAny,
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

  // useEffect(() => {
  //   if (!user && !session) fetchUser();
  // }, [user, session]);

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
    if (!routeReqs) return;

    // const required = routeReqs.permissions ?? [];
    // const mode = routeReqs.mode ?? "ANY";
    // const ok =
    //   required.length === 0
    //     ? true
    //     : mode === "ANY"
    //     ? canAny(required)
    //     : canAll(required);

    // console.log("route guard ok>>", { ok, routeReqs });

    if (!routeReqs) forbidden();
  }, [pathname, user, userPermissions]);

  console.log("route guard check>>", { user, userPermissions, isLoading });

  // unified loading gate to prevent any content flash
  if (!user || isLoading || !userPermissions) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
