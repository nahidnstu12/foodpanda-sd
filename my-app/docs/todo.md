// ===== STEP 1: DATABASE SCHEMA WITH PRISMA =====

// ===== STEP 2: OPTIMIZED DATA STRUCTURES =====

// ===== STEP 3: MEMORY CACHE SYSTEM =====

// ===== STEP 4: PRISMA SERVICE LAYER =====

// ===== STEP 5: ZUSTAND STORE =====

// ===== STEP 6: ROUTE PROTECTION =====

// ===== STEP 7: OPTIMIZED MIDDLEWARE =====

// ===== STEP 8: CLIENT-SIDE ROUTE GUARD =====

// ===== STEP 9: PERMISSION MANAGEMENT API =====

// ===== STEP 1: DATABASE SCHEMA WITH PRISMA =====

// schema.prisma
model User {
  id          String   @id @default(cuid())
  email       String   @unique
  name        String?
  roleId      String
  role        Role     @relation(fields: [roleId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("users")
}

model Role {
  id          String   @id @default(cuid())
  name        String   @unique // "admin", "rider", "customer"
  hierarchy   Int      @unique // 100, 60, 20 - higher = more access
  permissions RolePermission[]
  users       User[]

  @@map("roles")
}

model Permission {
  id          String   @id @default(cuid())
  name        String   @unique // "users:create", "orders:read"
  resource    String   // "users", "orders", "dashboard"
  action      String   // "create", "read", "update", "delete", "access"
  roles       RolePermission[]

  @@map("permissions")
}

model RolePermission {
  id           String     @id @default(cuid())
  roleId       String
  permissionId String
  role         Role       @relation(fields: [roleId], references: [id])
  permission   Permission @relation(fields: [permissionId], references: [id])

  @@unique([roleId, permissionId])
  @@map("role_permissions")
}

// ===== STEP 2: OPTIMIZED DATA STRUCTURES =====

interface UserPermissions {
  userId: string;
  roleId: string;
  roleName: string;
  roleHierarchy: number;
  permissions: Set<string>; // Set for O(1) lookups: ["users:create", "orders:read"]
  lastUpdated: Date;
}

// Permission format: "resource:action"
// Examples: "users:create", "orders:read", "dashboard:access"

// ===== STEP 3: MEMORY CACHE SYSTEM =====

class PermissionCache {
  private static instance: PermissionCache;
  private cache = new Map<string, UserPermissions>();
  private readonly TTL = 15 * 60 * 1000; // 15 minutes in milliseconds

  static getInstance(): PermissionCache {
    if (!PermissionCache.instance) {
      PermissionCache.instance = new PermissionCache();
    }
    return PermissionCache.instance;
  }

  // Get from memory cache
  get(userId: string): UserPermissions | null {
    const cached = this.cache.get(userId);
    
    if (!cached) return null;
    
    // Check if cache is expired
    if (Date.now() - cached.lastUpdated.getTime() > this.TTL) {
      this.cache.delete(userId);
      return null;
    }
    
    return cached;
  }

  // Set in memory cache
  set(userId: string, permissions: UserPermissions): void {
    this.cache.set(userId, {
      ...permissions,
      lastUpdated: new Date()
    });
  }

  // Delete from cache (for permission updates)
  delete(userId: string): void {
    this.cache.delete(userId);
  }

  // Clear entire cache (for role/permission structure changes)
  clear(): void {
    this.cache.clear();
  }

  // Get cache stats
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// ===== STEP 4: PRISMA SERVICE LAYER =====

import { prisma } from '@/lib/prisma';
import { cache } from 'react';

class PermissionService {
  private cache = PermissionCache.getInstance();

  // React cache for database calls (deduplication)
  private getCachedUserPermissions = cache(async (userId: string): Promise<UserPermissions> => {
    console.log('DB Query for user:', userId); // This should only run once per request
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true
              }
            }
          }
        }
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Convert to optimized format
    const permissions = new Set<string>();
    
    user.role.permissions.forEach(rp => {
      const permissionKey = `${rp.permission.resource}:${rp.permission.action}`;
      permissions.add(permissionKey);
    });

    return {
      userId: user.id,
      roleId: user.roleId,
      roleName: user.role.name,
      roleHierarchy: user.role.hierarchy,
      permissions,
      lastUpdated: new Date()
    };
  });

  // Main method to get user permissions with caching
  async getUserPermissions(userId: string): Promise<UserPermissions> {
    // Try memory cache first
    let permissions = this.cache.get(userId);
    
    if (permissions) {
      console.log('Cache HIT for user:', userId);
      return permissions;
    }

    console.log('Cache MISS for user:', userId);
    
    // Get from database with React cache
    permissions = await this.getCachedUserPermissions(userId);
    
    // Store in memory cache
    this.cache.set(userId, permissions);
    
    return permissions;
  }

  // Invalidate cache when permissions change
  async invalidateUserPermissions(userId: string): Promise<void> {
    this.cache.delete(userId);
    console.log('Invalidated cache for user:', userId);
  }

  // Invalidate all users with a specific role
  async invalidateRolePermissions(roleId: string): Promise<void> {
    // Get all users with this role
    const users = await prisma.user.findMany({
      where: { roleId },
      select: { id: true }
    });

    // Invalidate each user's cache
    users.forEach(user => {
      this.cache.delete(user.id);
    });

    console.log(`Invalidated cache for ${users.length} users with role:`, roleId);
  }

  // Clear all caches (when permission structure changes)
  async clearAllCaches(): Promise<void> {
    this.cache.clear();
    console.log('Cleared all permission caches');
  }
}

// ===== STEP 5: ZUSTAND STORE =====

import { create } from 'zustand';

interface AuthStore {
  user: any | null;
  permissions: UserPermissions | null;
  isLoading: boolean;
  
  // Actions
  setUser: (user: any) => void;
  loadPermissions: (userId: string) => Promise<void>;
  clearAuth: () => void;
  
  // Permission helpers
  can: (permission: string) => boolean;
  canAny: (permissions: string[]) => boolean;
  canAll: (permissions: string[]) => boolean;
  hasRole: (roleName: string) => boolean;
  hasMinHierarchy: (minHierarchy: number) => boolean;
}

const permissionService = new PermissionService();

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  permissions: null,
  isLoading: false,

  setUser: (user) => set({ user }),

  loadPermissions: async (userId) => {
    set({ isLoading: true });
    try {
      const permissions = await permissionService.getUserPermissions(userId);
      set({ permissions, isLoading: false });
    } catch (error) {
      console.error('Failed to load permissions:', error);
      set({ permissions: null, isLoading: false });
    }
  },

  clearAuth: () => set({ user: null, permissions: null }),

  // Check single permission: "users:create"
  can: (permission) => {
    const { permissions } = get();
    return permissions?.permissions.has(permission) ?? false;
  },

  // Check if user has ANY of the permissions
  canAny: (permissionList) => {
    const { permissions } = get();
    if (!permissions) return false;
    
    return permissionList.some(perm => permissions.permissions.has(perm));
  },

  // Check if user has ALL permissions
  canAll: (permissionList) => {
    const { permissions } = get();
    if (!permissions) return false;
    
    return permissionList.every(perm => permissions.permissions.has(perm));
  },

  // Check exact role
  hasRole: (roleName) => {
    const { permissions } = get();
    return permissions?.roleName === roleName;
  },

  // Check role hierarchy (admin can access rider pages)
  hasMinHierarchy: (minHierarchy) => {
    const { permissions } = get();
    return (permissions?.roleHierarchy ?? 0) >= minHierarchy;
  }
}));

// ===== STEP 6: ROUTE PROTECTION =====

// Define route permissions in a config file
export const ROUTE_CONFIG = {
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

// ===== STEP 7: OPTIMIZED MIDDLEWARE =====

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/login', '/register', '/'];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Basic session check (lightweight)
  const sessionCookie = request.cookies.get('session-token'); // Your session cookie name
  
  if (!sessionCookie?.value) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // For now, let client-side handle detailed permission checks
  // This keeps middleware fast
  return NextResponse.next();
}

// ===== STEP 8: CLIENT-SIDE ROUTE GUARD =====

'use client';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
import { getRouteRequirements } from '@/config/routes';
import { usePathname, useRouter } from 'next/navigation';

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

// ===== STEP 9: PERMISSION MANAGEMENT API =====

// app/api/admin/permissions/route.ts
export async function POST(request: NextRequest) {
  const { userId, roleId, action } = await request.json();
  const permissionService = new PermissionService();

  try {
    if (action === 'updateUserRole') {
      await prisma.user.update({
        where: { id: userId },
        data: { roleId }
      });
      
      // Invalidate user's permissions cache
      await permissionService.invalidateUserPermissions(userId);
    }
    
    if (action === 'updateRolePermissions') {
      // Update role permissions in database
      // ... your database updates ...
      
      // Invalidate all users with this role
      await permissionService.invalidateRolePermissions(roleId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ===== STEP 10: USAGE EXAMPLES =====

// In components
export function AdminPanel() {
  const { can, hasRole, hasMinHierarchy } = useAuthStore();

  // Role-based check
  if (!hasRole('admin')) {
    return <div>Admin access required</div>;
  }

  // Hierarchy-based check (admin or higher)
  if (!hasMinHierarchy(80)) {
    return <div>Insufficient permissions</div>;
  }

  return (
    <div>
      <h1>Admin Panel</h1>
      
      {/* Permission-based rendering */}
      {can('users:create') && (
        <button>Create User</button>
      )}
      
      {can('orders:read') && (
        <div>Order Management</div>
      )}
    </div>
  );
}

// In API routes
export async function GET(request: NextRequest) {
  // Get user from session
  const session = await getSession(request);
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Check permissions
  const permissionService = new PermissionService();
  const userPermissions = await permissionService.getUserPermissions(session.userId);
  
  if (!userPermissions.permissions.has('users:read')) {
    return new Response('Forbidden', { status: 403 });
  }

  // Process request...
  return NextResponse.json({ data: 'success' });
}