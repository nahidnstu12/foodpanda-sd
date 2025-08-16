// Define Permissions Data
// Grouped by modules for a Foodpanda-like system: User Management, Order Management, Delivery, Restaurant/Partner Management, Payments, etc.
// Each permission has a unique key, name, description, and optional group.

export const permissionsData = [
  // User Management Permissions
  {
    name: 'View Users',
    key: 'view_users',
    description: 'Allows viewing user details',
    group: 'user_management',
  },
  {
    name: 'Create Users',
    key: 'create_users',
    description: 'Allows creating new users',
    group: 'user_management',
  },
  {
    name: 'Update Users',
    key: 'update_users',
    description: 'Allows updating user details',
    group: 'user_management',
  },
  {
    name: 'Delete Users',
    key: 'delete_users',
    description: 'Allows deleting users',
    group: 'user_management',
  },
  {
    name: 'Manage Roles',
    key: 'manage_roles',
    description: 'Allows assigning and managing roles',
    group: 'user_management',
  },

  // Order Management Permissions
  {
    name: 'View Orders',
    key: 'view_orders',
    description: 'Allows viewing order details',
    group: 'order_management',
  },
  {
    name: 'Create Orders',
    key: 'create_orders',
    description: 'Allows placing new orders',
    group: 'order_management',
  },
  {
    name: 'Update Orders',
    key: 'update_orders',
    description: 'Allows updating order status or details',
    group: 'order_management',
  },
  {
    name: 'Cancel Orders',
    key: 'cancel_orders',
    description: 'Allows canceling orders',
    group: 'order_management',
  },

  // Delivery Management Permissions
  {
    name: 'View Deliveries',
    key: 'view_deliveries',
    description: 'Allows viewing delivery assignments',
    group: 'delivery_management',
  },
  {
    name: 'Assign Deliveries',
    key: 'assign_deliveries',
    description: 'Allows assigning orders to riders',
    group: 'delivery_management',
  },
  {
    name: 'Update Delivery Status',
    key: 'update_delivery_status',
    description: 'Allows riders to update delivery progress',
    group: 'delivery_management',
  },

  // Partner/Restaurant Management Permissions
  {
    name: 'View Partners',
    key: 'view_partners',
    description: 'Allows viewing restaurant/partner details',
    group: 'partner_management',
  },
  {
    name: 'Create Partners',
    key: 'create_partners',
    description: 'Allows onboarding new partners',
    group: 'partner_management',
  },
  {
    name: 'Update Partners',
    key: 'update_partners',
    description: 'Allows updating partner details',
    group: 'partner_management',
  },
  {
    name: 'Manage Menu',
    key: 'manage_menu',
    description: 'Allows partners to manage their menu items',
    group: 'partner_management',
  },

  // Payment Management Permissions
  {
    name: 'View Payments',
    key: 'view_payments',
    description: 'Allows viewing payment transactions',
    group: 'payment_management',
  },
  {
    name: 'View Payments',
    key: 'create_payment',
    description: '',
    group: 'payment_management',
  },
  {
    name: 'Process Refunds',
    key: 'process_refunds',
    description: 'Allows processing refunds',
    group: 'payment_management',
  },

  // System Settings Permissions
  {
    name: 'Manage Settings',
    key: 'manage_settings',
    description: 'Allows changing system configurations',
    group: 'system_settings',
  },
];

// Define Roles Data
// Roles aligned with UserType enum: SUPER_ADMIN, ADMIN, PARTNER, RIDER, CUSTOMER
// Each role has permissions assigned via keys.

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
      // User Management (full)
      'view_users',
      'create_users',
      'update_users',
      'delete_users',
      'manage_roles',
      // Order Management (full)
      'view_orders',
      'create_orders',
      'update_orders',
      'cancel_orders',
      // Delivery Management (full)
      'view_deliveries',
      'assign_deliveries',
      'update_delivery_status',
      // Partner Management (full)
      'view_partners',
      'create_partners',
      'update_partners',
      'manage_menu',
      // Payment Management (full)
      'view_payments',
      'process_refunds',
      // System Settings
      'manage_settings',
    ],
  },
  {
    name: 'Partner',
    key: 'PARTNER',
    description: 'Manages own restaurant, menu, and orders',
    permissions: [
      // Order Management (limited)
      'view_orders',
      'update_orders',
      'cancel_orders',
      // Partner Management (own)
      'view_partners',
      'update_partners',
      'manage_menu',
      // Payments (view own)
      'view_payments',
    ],
  },
  {
    name: 'Rider',
    key: 'RIDER',
    description: 'Handles deliveries',
    permissions: [
      // Delivery Management (own)
      'view_deliveries',
      'update_delivery_status',
      // Order Management (view own)
      'view_orders',
    ],
  },
  {
    name: 'Customer',
    key: 'CUSTOMER',
    description: 'Places and manages own orders',
    permissions: [
      // Order Management (own)
      'view_orders',
      'create_orders',
      'cancel_orders',
      // Payments (own)
      'view_payments',
    ],
  },
];
