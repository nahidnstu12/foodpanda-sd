// my-app/src/components/shared/route-guard.tsx
'use client';
import { getRouteRequirements } from '@/helpers/route';
import { useSession } from '@/lib/auth-client';
import { useAuthStore } from '@/store/authStore';
import { forbidden, usePathname } from 'next/navigation';
import { useEffect } from 'react';

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

  // hydrate user from session
  useEffect(() => {
    if (session?.user && !user) setUser(session.user);
    else console.log('sessionuser', { user, session });
  }, [session?.user, user, setUser]);

  // load permissions once we have user
  useEffect(() => {
    if (user?.id && !userPermissions) loadPermissions(user.id);
    else console.log('userPermissions exist');
  }, [user?.id, userPermissions, loadPermissions]);

  // strictly block rendering until permissions are present or no route requirements
  useEffect(() => {
    if (!user || !userPermissions) return; // still initializing

    const routeReqs = getRouteRequirements(pathname);
    if (!routeReqs) return;

    const required = routeReqs.permissions ?? [];
    const mode = routeReqs.mode ?? 'ANY';
    const ok =
      required.length === 0
        ? true
        : mode === 'ANY'
        ? canAny(required)
        : canAll(required);

    console.log('route guard ok>>', { ok, routeReqs });

    if (!ok) forbidden();
  }, [pathname, user, userPermissions, canAll]);

  console.log('route guard check>>', { user, userPermissions, isLoading });

  // unified loading gate to prevent any content flash
  if (!user || isLoading || !userPermissions) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
