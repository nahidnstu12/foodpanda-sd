import { UserRole } from '@/helpers/user.enum';
import { ROUTES } from './browser-route';
import { PERMISSIONS } from './permissions';

export interface RouteConfig {
  permissions: string[];
  mode?: 'ANY' | 'ALL'; // ANY: user needs at least one permission, ALL: user needs all permissions
  roles?: string[]; // Optional: restrict to specific roles
}

export const publicRoutes = [
  ROUTES.Auth.Login,
  ROUTES.Auth.Signup,
  ROUTES.Auth.ForgotPassword,
  ROUTES.Auth.VerifyEmail,
];

export const dashboardRoutes = [
  ROUTES.Admin.Dashboard,
  ROUTES.Partner.Dashboard,
  ROUTES.Rider.Dashboard,
  ROUTES.Customer.Dashboard,
];

export const ROUTE_CONFIG: Record<string, RouteConfig> = {
  // --- Admin Routes ---
  [ROUTES.Admin.Dashboard]: {
    permissions: [PERMISSIONS.VIEW_DASHBOARD],
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  },
  [ROUTES.Admin.Users]: { permissions: [PERMISSIONS.VIEW_USER] },
  [ROUTES.Admin.UserPermissions]: { permissions: [PERMISSIONS.VIEW_USER] },
  [ROUTES.Admin.Permissions]: { permissions: [PERMISSIONS.VIEW_PERMISSION] },
  [ROUTES.Admin.Roles]: { permissions: [PERMISSIONS.MANAGE_ROLES] },
  [ROUTES.Admin.RolePermissions]: { permissions: [PERMISSIONS.MANAGE_ROLES] },
  [ROUTES.Admin.Partners]: { permissions: [PERMISSIONS.VIEW_PARTNER] },
  [ROUTES.Admin.PartnersOnboard]: {
    permissions: [PERMISSIONS.CREATE_PARTNER],
  },
  [ROUTES.Admin.Restaurants]: { permissions: [PERMISSIONS.VIEW_PARTNER] },
  [ROUTES.Admin.Menus]: { permissions: [PERMISSIONS.MANAGE_MENU] },
  [ROUTES.Admin.Riders]: { permissions: [PERMISSIONS.VIEW_RIDER] },
  [ROUTES.Admin.RidersOnboard]: { permissions: [PERMISSIONS.CREATE_RIDER] },
  [ROUTES.Admin.Orders]: { permissions: [PERMISSIONS.VIEW_ORDER] },
  [ROUTES.Admin.OrdersTracking]: { permissions: [PERMISSIONS.VIEW_ORDER] },
  [ROUTES.Admin.Deliveries]: { permissions: [PERMISSIONS.VIEW_DELIVERIES] },
  [ROUTES.Admin.DeliveriesAssign]: {
    permissions: [PERMISSIONS.ASSIGN_DELIVERIES],
  },
  [ROUTES.Admin.Payments]: { permissions: [PERMISSIONS.VIEW_PAYMENTS] },
  [ROUTES.Admin.PaymentsRefunds]: {
    permissions: [PERMISSIONS.PROCESS_REFUND],
  },
  [ROUTES.Admin.Reviews]: { permissions: [PERMISSIONS.MODERATE_REVIEWS] },
  [ROUTES.Admin.Notifications]: {
    permissions: [PERMISSIONS.SEND_NOTIFICATIONS],
  },
  [ROUTES.Admin.Reports]: { permissions: [PERMISSIONS.VIEW_REPORTS] },
  [ROUTES.Admin.Settings]: { permissions: [PERMISSIONS.MANAGE_SETTINGS] },

  // --- Partner Routes ---
  [ROUTES.Partner.Dashboard]: {
    permissions: [PERMISSIONS.VIEW_DASHBOARD],
    roles: [UserRole.PARTNER],
  },
  [ROUTES.Partner.Menu]: { permissions: [PERMISSIONS.MANAGE_MENU] },
  [ROUTES.Partner.MenuCategories]: { permissions: [PERMISSIONS.MANAGE_MENU] },
  [ROUTES.Partner.MenuItems]: { permissions: [PERMISSIONS.MANAGE_MENU] },
  [ROUTES.Partner.OrdersActive]: { permissions: [PERMISSIONS.VIEW_ORDER] },
  [ROUTES.Partner.OrdersHistory]: { permissions: [PERMISSIONS.VIEW_ORDER] },
  [ROUTES.Partner.Restaurant]: { permissions: [PERMISSIONS.UPDATE_PARTNER] },
  [ROUTES.Partner.Earnings]: { permissions: [PERMISSIONS.VIEW_PAYMENTS] },
  [ROUTES.Partner.Reviews]: { permissions: [PERMISSIONS.VIEW_REVIEW] },
  [ROUTES.Partner.Notifications]: {
    permissions: [PERMISSIONS.VIEW_NOTIFICATIONS],
  },

  // --- Rider Routes ---
  [ROUTES.Rider.Dashboard]: {
    permissions: [PERMISSIONS.VIEW_DASHBOARD],
    roles: [UserRole.RIDER],
  },
  [ROUTES.Rider.DeliveriesActive]: {
    permissions: [PERMISSIONS.VIEW_DELIVERIES],
  },
  [ROUTES.Rider.DeliveriesHistory]: {
    permissions: [PERMISSIONS.VIEW_DELIVERIES],
  },
  [ROUTES.Rider.Orders]: { permissions: [PERMISSIONS.VIEW_ORDER] },
  [ROUTES.Rider.Earnings]: { permissions: [PERMISSIONS.VIEW_PAYMENTS] },
  [ROUTES.Rider.Profile]: { permissions: [PERMISSIONS.VIEW_NOTIFICATIONS] },
  [ROUTES.Rider.Notifications]: {
    permissions: [PERMISSIONS.VIEW_NOTIFICATIONS],
  },

  // --- Customer Routes ---
  [ROUTES.Customer.Dashboard]: {
    permissions: [PERMISSIONS.VIEW_DASHBOARD],
    roles: [UserRole.CUSTOMER],
  },
  [ROUTES.Customer.Restaurants]: { permissions: [PERMISSIONS.CREATE_ORDER] },
  [ROUTES.Customer.OrdersActive]: { permissions: [PERMISSIONS.VIEW_ORDER] },
  [ROUTES.Customer.OrdersHistory]: { permissions: [PERMISSIONS.VIEW_ORDER] },
  [ROUTES.Customer.Payments]: { permissions: [PERMISSIONS.VIEW_PAYMENTS] },
  [ROUTES.Customer.Reviews]: { permissions: [PERMISSIONS.CREATE_REVIEW] },
  [ROUTES.Customer.Profile]: { permissions: [PERMISSIONS.VIEW_NOTIFICATIONS] },
  [ROUTES.Customer.Notifications]: {
    permissions: [PERMISSIONS.VIEW_NOTIFICATIONS],
  },
  [ROUTES.Customer.Help]: { permissions: [PERMISSIONS.VIEW_NOTIFICATIONS] },
};
