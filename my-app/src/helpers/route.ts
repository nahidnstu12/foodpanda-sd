import { redirect } from 'next/navigation';
export const publicRoutes = ['/login', '/signup', '/forgot-password', '/verify-email'];
export const dashboardRoutes = {
  '/dashboard/super-admin': ['SUPER_ADMIN'],
  '/dashboard/admin': ['SUPER_ADMIN', 'ADMIN'],
  '/dashboard/partner': ['SUPER_ADMIN', 'ADMIN', 'PARTNER'],
  '/dashboard/rider': ['SUPER_ADMIN', 'ADMIN', 'RIDER'],
  '/dashboard/customer': ['SUPER_ADMIN', 'ADMIN', 'CUSTOMER', 'PARTNER', 'RIDER'],
};
type RouteConfig = {
  permissions: string[];
  minHierarchy: number; // remove later
};
export const ROUTE_CONFIG: Record<string, RouteConfig> = {
  // Admin routes
  '/dashboard/admin': { 
    permissions: ['dashboard:access'], 
    minHierarchy: 80 
  },
  '/dashboard/admin/users': { 
    permissions: ['users:read'], 
    minHierarchy: 80 
  },
  '/dashboard/admin/orders': { 
    permissions: ['orders:read'], 
    minHierarchy: 80 
  },
  
  // Rider routes
  '/dashboard/rider': { 
    permissions: ['dashboard:access'], 
    minHierarchy: 60 
  },
  '/dashboard/rider/orders': { 
    permissions: ['orders:update'], 
    minHierarchy: 60 
  },
  
  // Customer routes
  '/dashboard/customer': { 
    permissions: ['dashboard:access'], 
    minHierarchy: 20 
  },
  '/dashboard/customer/orders': { 
    permissions: ['orders:create'], 
    minHierarchy: 20 
  },
};

// Helper to check route access
export function getRouteRequirements(pathname: string) {
  // Exact match first
  if (ROUTE_CONFIG[pathname]) {
    return ROUTE_CONFIG[pathname];
  }
  
  // Find best matching pattern
  const matchingRoute = Object.keys(ROUTE_CONFIG)
    .filter(route => pathname.startsWith(route))
    .sort((a, b) => b.length - a.length)[0]; // Longest match wins
    
  return matchingRoute ? ROUTE_CONFIG[matchingRoute] : null;
}



export function redirectToUnauthorized(message?: string, redirectTo?: string) {
  const params = new URLSearchParams();
  if (message) params.set('message', message);
  if (redirectTo) params.set('redirectTo', redirectTo);
  
  redirect(`/unauthorized?${params.toString()}`);
}

export function checkPermission(
  userPermissions: Set<string>, 
  requiredPermission: string
): boolean {
  return userPermissions.has(requiredPermission);
}

export function requirePermission(
  userPermissions: Set<string>, 
  requiredPermission: string,
  message?: string
) {
  if (!checkPermission(userPermissions, requiredPermission)) {
    redirectToUnauthorized(
      message || `You need ${requiredPermission} permission to access this resource.`
    );
  }
}


// // In your components/pages
// import { requirePermission, checkPermission } from '@/lib/auth-utils';

// // Check permission before rendering
// if (!checkPermission(userPermissions, 'user:delete')) {
//   return <div>Access denied</div>;
// }

// // Or redirect immediately
// requirePermission(userPermissions, 'admin:access', 'Admin access required');

// // In your middleware or auth guards
// export function AdminOnlyGuard({ userPermissions, children }) {
//   if (!checkPermission(userPermissions, 'admin:access')) {
//     redirectToUnauthorized('Admin access required', '/dashboard');
//   }
  
//   return children;
// }