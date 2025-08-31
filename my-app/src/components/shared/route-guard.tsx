
'use client';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { getRouteRequirements } from '@/helpers/route';

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { 
    user, 
    permissions, 
    isLoading, 
    loadPermissions, 
    canAll, 
    hasMinHierarchy 
  } = useAuthStore();

  useEffect(() => {
    if (user?.id && !permissions) {
      loadPermissions(user.id);
    }
  }, [user?.id, permissions, loadPermissions]);

  // Loading state
  if (isLoading || (user && !permissions)) {
    return <div>Loading permissions...</div>;
  }

  // Check route requirements
  const routeReqs = getRouteRequirements(pathname);
  
  if (routeReqs) {
    // Check permissions
    if (routeReqs.permissions && !canAll(routeReqs.permissions)) {
      router.push('/unauthorized');
      return <div>Redirecting...</div>;
    }
    
    // Check hierarchy
    if (routeReqs.minHierarchy && !hasMinHierarchy(routeReqs.minHierarchy)) {
      router.push('/unauthorized');
      return <div>Redirecting...</div>;
    }
  }

  return <>{children}</>;
}
