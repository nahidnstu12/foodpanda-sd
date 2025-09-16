/**
 * A comprehensive, auto-generated list of permission keys.
 * This object serves as a single source of truth for permission checks
 * throughout the application, preventing typos and ensuring consistency.
 * It is derived directly from the permission seeder data.
 */
export const PERMISSIONS = {
  // --- Generated from createCrudPermissions('User') ---
  LIST_USERS: "list_users",
  VIEW_USER: "view_user",
  CREATE_USER: "create_user",
  UPDATE_USER: "update_user",
  DELETE_USER: "delete_user",

  // --- Generated from createCrudPermissions('Role') ---
  LIST_ROLES: "list_roles",
  VIEW_ROLE: "view_role",
  CREATE_ROLE: "create_role",
  UPDATE_ROLE: "update_role",
  DELETE_ROLE: "delete_role",

  // --- Generated from createCrudPermissions('Permission') ---
  LIST_PERMISSIONS: "list_permissions",
  VIEW_PERMISSION: "view_permission",
  CREATE_PERMISSION: "create_permission",
  UPDATE_PERMISSION: "update_permission",
  DELETE_PERMISSION: "delete_permission",

  // --- Generated from createCrudPermissions('Partner') ---
  LIST_PARTNERS: "list_partners",
  VIEW_PARTNER: "view_partner",
  CREATE_PARTNER: "create_partner",
  UPDATE_PARTNER: "update_partner",
  DELETE_PARTNER: "delete_partner",

  // --- Generated from createCrudPermissions('Rider') ---
  LIST_RIDERS: "list_riders",
  VIEW_RIDER: "view_rider",
  CREATE_RIDER: "create_rider",
  UPDATE_RIDER: "update_rider",
  DELETE_RIDER: "delete_rider",

  // --- Generated from createCrudPermissions('Order') ---
  LIST_ORDERS: "list_orders",
  VIEW_ORDER: "view_order",
  CREATE_ORDER: "create_order",
  UPDATE_ORDER: "update_order",
  DELETE_ORDER: "delete_order",

  // --- Generated from createCrudPermissions('Review') ---
  LIST_REVIEWS: "list_reviews",
  VIEW_REVIEW: "view_review",
  CREATE_REVIEW: "create_review",
  UPDATE_REVIEW: "update_review",
  DELETE_REVIEW: "delete_review",

  // --- Custom, Action-Based Permissions ---
  VIEW_DASHBOARD: "view_dashboard",
  MANAGE_ROLES: "manage_roles",
  MANAGE_MENU: "manage_menu",
  CANCEL_ORDER: "cancel_order",
  VIEW_DELIVERIES: "view_deliveries",
  ASSIGN_DELIVERIES: "assign_deliveries",
  UPDATE_DELIVERY_STATUS: "update_delivery_status",
  VIEW_ALL_DELIVERIES: "view_all_deliveries",
  VIEW_PAYMENTS: "view_payments",
  CREATE_PAYMENT: "create_payment",
  PROCESS_REFUND: "process_refund",
  MODERATE_REVIEWS: "moderate_reviews",
  VIEW_NOTIFICATIONS: "view_notifications",
  SEND_NOTIFICATIONS: "send_notifications",
  MANAGE_SETTINGS: "manage_settings",
  VIEW_REPORTS: "view_reports",

} as const;
