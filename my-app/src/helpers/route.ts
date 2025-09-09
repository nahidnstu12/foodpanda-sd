import { ROUTE_CONFIG } from "@/config/route-list";

export type PermissionMode = "ANY" | "ALL";

export function checkPermission(
  userPermissions: Set<string>,
  requiredPermission: string
): boolean {
  return userPermissions.has(requiredPermission);
}

export function checkPermissions(
  userPermissions: Set<string>,
  requiredPermissions: string[],
  mode: PermissionMode = "ALL"
): boolean {
  if (requiredPermissions.length === 0) return true;
  if (mode === "ANY")
    return requiredPermissions.some((p) => userPermissions.has(p));
  return requiredPermissions.every((p) => userPermissions.has(p));
}

export const hasRouteAccess = (
  route: string,
  userPermissions: Set<string>,
  userRole: string
): boolean => {
  const routeConfig = ROUTE_CONFIG[route];
  if (!routeConfig) return false;

  // Check role restriction first
  if (routeConfig.roles && !routeConfig.roles.includes(userRole)) {
    return false;
  }

  // Check permissions
  const { permissions, mode = "ANY" } = routeConfig;

  if (mode === "ALL") {
    return permissions.every((permission) => userPermissions.has(permission));
  } else {
    return permissions.some((permission) => userPermissions.has(permission));
  }
};
