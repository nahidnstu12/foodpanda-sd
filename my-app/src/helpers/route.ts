import { redirect } from "next/navigation";

export const publicRoutes = ["/login", "/signup", "/forgot-password", "/verify-email"];
export const dashboardRoutes = ["/dashboard/admin", "/dashboard/partner", "/dashboard/rider", "/dashboard/customer"];

type PermissionMode = "ALL" | "ANY";

type RouteConfig = {
  permissions: string[];
  mode?: PermissionMode; // default: ALL
};

// IMPORTANT: use your real permission keys
export const ROUTE_CONFIG: Record<string, RouteConfig> = {
  // Admin
  "/dashboard/admin": { permissions: ["manage_menu"], mode: "ANY" },
  "/dashboard/admin/users": { permissions: ["view_partners", "view_orders"], mode: "ANY" },
  "/dashboard/admin/orders": { permissions: ["view_orders"] },

  // Partner
  "/dashboard/partner": { permissions: ["view_orders", "view_partners"], mode: "ANY" },
  "/dashboard/partner/orders": { permissions: ["view_orders"] },

  // Rider
  "/dashboard/rider": { permissions: ["view_deliveries", "view_orders"], mode: "ANY" },
  "/dashboard/rider/orders": { permissions: ["view_orders", "update_delivery_status"], mode: "ANY" },
  "/dashboard/rider/deliveries": { permissions: ["view_deliveries"] },

  // Customer
  "/dashboard/customer": { permissions: ["view_orders"], mode: "ANY" },
  "/dashboard/customer/orders": { permissions: ["view_orders"] },
};

export function getRouteRequirements(pathname: string): RouteConfig | null {
  if (ROUTE_CONFIG[pathname]) return ROUTE_CONFIG[pathname];

  const matchingRoute = Object.keys(ROUTE_CONFIG)
    .filter((route) => pathname.startsWith(route))
    .sort((a, b) => b.length - a.length)[0];

  return matchingRoute ? ROUTE_CONFIG[matchingRoute] : null;
}

export function redirectToUnauthorized(message?: string, redirectTo?: string) {
  const params = new URLSearchParams();
  if (message) params.set("message", message);
  if (redirectTo) params.set("redirectTo", redirectTo);
  redirect(`/unauthorized?${params.toString()}`);
}

export function checkPermission(userPermissions: Set<string>, requiredPermission: string): boolean {
  return userPermissions.has(requiredPermission);
}

export function checkPermissions(
  userPermissions: Set<string>,
  requiredPermissions: string[],
  mode: PermissionMode = "ALL"
): boolean {
  if (requiredPermissions.length === 0) return true;
  if (mode === "ANY") return requiredPermissions.some((p) => userPermissions.has(p));
  return requiredPermissions.every((p) => userPermissions.has(p));
}