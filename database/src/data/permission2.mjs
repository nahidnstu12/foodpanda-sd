

/**
* A factory function to generate a standard set of CRUD permissions for an entity.
* This reduces boilerplate and ensures consistency.
*
* @param entity - The singular name of the entity (e.g., 'User', 'Role', 'Partner').
* @param group - The group name for these permissions.
* @returns An array of permission objects for Create, Read (View), Update, Delete.
*/
function createCrudPermissions(entity, group) {
  const entityKey = entity.toLowerCase().replace(' ', '_');
  // Simple pluralization for keys (e.g., 'user' -> 'users')
  const pluralKey = `${entityKey}s`;

  return [
    {
      name: `List ${entity}s`,
      key: `list_${pluralKey}`,
      description: `Allows listing ${entity.toLowerCase()}s`,
      group,
    },
    {
      name: `View ${entity}`,
      key: `view_${entityKey}`,
      description: `Allows viewing ${entity.toLowerCase()} details`,
      group,
    },
    {
      name: `Create ${entity}`,
      key: `create_${entityKey}`,
      description: `Allows creating new ${entity.toLowerCase()}s`,
      group,
    },
    {
      name: `Update ${entity}`,
      key: `update_${entityKey}`,
      description: `Allows updating ${entity.toLowerCase()} details`,
      group,
    },
    {
      name: `Delete ${entity}`,
      key: `delete_${entityKey}`,
      description: `Allows deleting ${entity.toLowerCase()}s`,
      group,
    },
  ];
}

// --- Main Permissions Data Definition ---
// This is now much cleaner and easier to read.
export const permissionsData = [
  // --- Generated CRUD Permissions ---
  ...createCrudPermissions('User', 'user_management'),
  ...createCrudPermissions('Role', 'role_management'),
  ...createCrudPermissions('Permission', 'permission_management'),
  ...createCrudPermissions('Partner', 'partner_management'),
  ...createCrudPermissions('Rider', 'rider_management'),
  ...createCrudPermissions('Order', 'order_management'),
  ...createCrudPermissions('Review', 'review_management'),

  // --- Custom, Action-Based Permissions ---

  // Dashboard
  { name: 'View Dashboard', key: 'view_dashboard', description: 'Allows viewing main dashboard and analytics', group: 'dashboard' },

  // User Management (Special cases)
  { name: 'Manage Roles', key: 'manage_roles', description: 'Allows assigning and managing roles', group: 'role_management' },

  // Partner Management (Special cases)
  { name: 'Manage Menu', key: 'manage_menu', description: 'Allows partners to manage their menu items', group: 'partner_management' },
  

  // Order Management (Special cases)
  { name: 'Cancel Orders', key: 'cancel_order', description: 'Allows canceling orders', group: 'order_management' },


  // Delivery Management
  { name: 'View Deliveries', key: 'view_deliveries', description: 'Allows viewing delivery assignments', group: 'delivery_management' },
  { name: 'Assign Deliveries', key: 'assign_deliveries', description: 'Allows assigning orders to riders', group: 'delivery_management' },
  { name: 'Update Delivery Status', key: 'update_delivery_status', description: 'Allows riders to update delivery progress', group: 'delivery_management' },
  { name: 'View All Deliveries', key: 'view_all_deliveries', description: 'Allows viewing all delivery information', group: 'delivery_management' },

  // Payment Management
  { name: 'View Payments', key: 'view_payments', description: 'Allows viewing payment transactions', group: 'payment_management' },
  { name: 'Create Payment', key: 'create_payment', description: 'Allows creating payment transactions', group: 'payment_management' },
  { name: 'Process Refunds', key: 'process_refund', description: 'Allows processing refunds', group: 'payment_management' },
  
  // Review Management (Special cases)
  { name: 'Moderate Reviews', key: 'moderate_reviews', description: 'Allows moderating and managing reviews', group: 'review_management' },

  // Notifications
  { name: 'View Notifications', key: 'view_notifications', description: 'Allows viewing notifications', group: 'notification_management' },
  { name: 'Send Notifications', key: 'send_notifications', description: 'Allows sending notifications to users', group: 'notification_management' },

  // System Settings
  { name: 'Manage Settings', key: 'manage_settings', description: 'Allows changing system configurations', group: 'system_settings' },
  { name: 'View Reports', key: 'view_reports', description: 'Allows viewing system reports and analytics', group: 'system_settings' },
  {name: "User Role Change", key: "user_role_change", group:"user_management"}
];


// Enhanced Roles Data
export const rolesData = [
  {
    name: 'Super Admin',
    key: 'SUPER_ADMIN',
    description: 'Has all permissions in the system',
    permissions: permissionsData.map((perm) => perm.key), // All permissions
  },
  {
    name: 'Admin',
    key: 'ADMIN',
    description: 'Manages users, orders, deliveries, and partners',
    permissions: [
      'view_dashboard',
      // User Management (full)
      'list_users',
      'view_user',
      'create_user',
      'update_user',
      'delete_user',
      "user_role_change",
      'manage_roles',
      'list_permissions',
      'view_permission',
      'create_permission',
      'update_permission',
      'delete_permission',
      'list_roles',
      'view_role',
      'create_role',
      'update_role',
      'delete_role',
      // Order Management (full)
      'list_orders',
      'view_order',
      'create_order',
      'update_order',
      'cancel_order',
      // Delivery Management (full)
      'view_deliveries',
      'view_all_deliveries',
      'assign_deliveries',
      'update_delivery_status',
      // Partner Management (full)
      'list_partners',
      'view_partner',
      'create_partner',
      'update_partner',
      'delete_partner',
      'manage_menu',
      // Rider Management (full)
      'list_riders',
      'view_rider',
      'create_rider',
      'update_rider',
      'delete_rider',
      // Payment Management (full)
      
      'view_payments',
      'process_refund',
      // Review Management
      'list_reviews',
      'view_review',
      'moderate_reviews',
      // Notifications
      'view_notifications',
      'send_notifications',
      // System Settings
      'manage_settings',
      'view_reports',
    ],
  },
  {
    name: 'Partner',
    key: 'PARTNER',
    description: 'Manages own restaurant, menu, and orders',
    permissions: [
      'view_dashboard',
      // Order Management (own orders only)
      'list_orders',
      'view_order',
      'update_order',
      'cancel_order',
      // Partner Management (own profile only)
      'view_partner',
      'update_partner',
      'manage_menu',
      // Payments (view own)
      
      'view_payments',
      // Reviews (view own)
      'view_review',
      // Notifications
      'view_notifications',
    ],
  },
  {
    name: 'Rider',
    key: 'RIDER',
    description: 'Handles deliveries and manages delivery status',
    permissions: [
      'view_dashboard',
      // Delivery Management (own deliveries)
      'view_deliveries',
      'update_delivery_status',
      // Order Management (view assigned orders)
      'list_orders',
      'view_order',
      // Notifications
      'view_notifications',
      // Payments (view own earnings)
      
      'view_payments',
    ],
  },
  {
    name: 'Customer',
    key: 'CUSTOMER',
    description: 'Places and manages own orders, writes reviews',
    permissions: [
      'view_dashboard',
      // Order Management (own orders)
      'list_orders',
      'view_order',
      'create_order',
      'cancel_order',
      // Payments (own payments)
      
      'view_payments',
      'create_payment',
      // Reviews
      'list_reviews',
      'view_review',
      'create_review',
      // Notifications
      'view_notifications',
    ],
  },
];

