import { redirect } from "next/navigation";

export const publicRoutes = [
  "/login",
  "/signup",
  "/forgot-password",
  "/verify-email",
];
export const dashboardRoutes = [
  "/dashboard/admin",
  "/dashboard/partner",
  "/dashboard/rider",
  "/dashboard/customer",
];

type PermissionMode = "ALL" | "ANY";

// type RouteConfig = {
//   permissions: string[];
//   mode?: PermissionMode; // default: ALL
// };

export interface RouteConfig {
  permissions: string[];
  mode?: "ANY" | "ALL"; // ANY: user needs at least one permission, ALL: user needs all permissions
  roles?: string[]; // Optional: restrict to specific roles
}

// IMPORTANT: use your real permission keys
// export const ROUTE_CONFIG: Record<string, RouteConfig> = {
//   // Admin
//   "/dashboard/admin": { permissions: ["manage_menu"], mode: "ANY" },
//   "/dashboard/admin/users": { permissions: ["view_partners", "view_orders"], mode: "ANY" },
//   "/dashboard/admin/orders": { permissions: ["view_orders"] },

//   // Partner
//   "/dashboard/partner": { permissions: ["view_orders", "view_partners"], mode: "ANY" },
//   "/dashboard/partner/orders": { permissions: ["view_orders"] },

//   // Rider
//   "/dashboard/rider": { permissions: ["view_deliveries", "view_orders"], mode: "ANY" },
//   "/dashboard/rider/orders": { permissions: ["view_orders", "update_delivery_status"], mode: "ANY" },
//   "/dashboard/rider/deliveries": { permissions: ["view_deliveries"] },

//   // Customer
//   "/dashboard/customer": { permissions: ["view_orders"], mode: "ANY" },
//   "/dashboard/customer/orders": { permissions: ["view_orders"] },
// };
// Route Configuration Interface

export const ROUTE_CONFIG: Record<string, RouteConfig> = {
  // Admin Routes
  "/admin/dashboard": {
    permissions: ["view_dashboard"],
    roles: ["SUPER_ADMIN", "ADMIN"],
  },
  "/admin/users": { permissions: ["view_users"] },
  "/admin/roles": { permissions: ["manage_roles"] },
  "/admin/partners": { permissions: ["view_all_partners"] },
  "/admin/partners/onboard": { permissions: ["create_partners"] },
  "/admin/restaurants": { permissions: ["view_all_partners"] },
  "/admin/menus": { permissions: ["manage_menu"] },
  "/admin/riders": { permissions: ["view_riders"] },
  "/admin/riders/onboard": { permissions: ["create_riders"] },
  "/admin/orders": { permissions: ["view_all_orders"] },
  "/admin/orders/tracking": { permissions: ["view_all_orders"] },
  "/admin/deliveries": { permissions: ["view_all_deliveries"] },
  "/admin/deliveries/assign": { permissions: ["assign_deliveries"] },
  "/admin/payments": { permissions: ["view_all_payments"] },
  "/admin/payments/refunds": { permissions: ["process_refunds"] },
  "/admin/reviews": { permissions: ["moderate_reviews"] },
  "/admin/notifications": { permissions: ["send_notifications"] },
  "/admin/reports": { permissions: ["view_reports"] },
  "/admin/settings": { permissions: ["manage_settings"] },

  // Partner Routes
  "/partner/dashboard": { permissions: ["view_dashboard"], roles: ["PARTNER"] },
  "/partner/menu": { permissions: ["manage_menu"] },
  "/partner/menu/categories": { permissions: ["manage_menu"] },
  "/partner/menu/items": { permissions: ["manage_menu"] },
  "/partner/orders/active": { permissions: ["view_orders"] },
  "/partner/orders/history": { permissions: ["view_orders"] },
  "/partner/restaurant": { permissions: ["update_partners"] },
  "/partner/earnings": { permissions: ["view_payments"] },
  "/partner/reviews": { permissions: ["view_reviews"] },
  "/partner/notifications": { permissions: ["view_notifications"] },

  // Rider Routes
  "/rider/dashboard": { permissions: ["view_dashboard"], roles: ["RIDER"] },
  "/rider/deliveries/active": { permissions: ["view_deliveries"] },
  "/rider/deliveries/history": { permissions: ["view_deliveries"] },
  "/rider/orders": { permissions: ["view_orders"] },
  "/rider/earnings": { permissions: ["view_payments"] },
  "/rider/profile": { permissions: ["view_notifications"] },
  "/rider/notifications": { permissions: ["view_notifications"] },

  // Customer Routes
  "/customer/dashboard": {
    permissions: ["view_dashboard"],
    roles: ["CUSTOMER"],
  },
  "/customer/restaurants": { permissions: ["create_orders"] },
  "/customer/orders/active": { permissions: ["view_orders"] },
  "/customer/orders/history": { permissions: ["view_orders"] },
  "/customer/payments": { permissions: ["view_payments"] },
  "/customer/reviews": { permissions: ["create_reviews"] },
  "/customer/profile": { permissions: ["view_notifications"] },
  "/customer/notifications": { permissions: ["view_notifications"] },
  "/customer/help": { permissions: ["view_notifications"] },
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
