
  
  // Enhanced Permissions Data with proper grouping and descriptions
  export const permissionsData = [
    // Dashboard Permissions
    {
      name: 'View Dashboard',
      key: 'view_dashboard',
      description: 'Allows viewing main dashboard and analytics',
      group: 'dashboard',
    },
  
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
    {
      name: 'View All Orders',
      key: 'view_all_orders',
      description: 'Allows viewing orders from all users/restaurants',
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
    {
      name: 'View All Deliveries',
      key: 'view_all_deliveries',
      description: 'Allows viewing all delivery information',
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
      name: 'Delete Partners',
      key: 'delete_partners',
      description: 'Allows removing partners',
      group: 'partner_management',
    },
    {
      name: 'Manage Menu',
      key: 'manage_menu',
      description: 'Allows partners to manage their menu items',
      group: 'partner_management',
    },
    {
      name: 'View All Partners',
      key: 'view_all_partners',
      description: 'Allows viewing all restaurant partners',
      group: 'partner_management',
    },
  
    // Rider Management Permissions
    {
      name: 'View Riders',
      key: 'view_riders',
      description: 'Allows viewing rider details',
      group: 'rider_management',
    },
    {
      name: 'Create Riders',
      key: 'create_riders',
      description: 'Allows adding new riders',
      group: 'rider_management',
    },
    {
      name: 'Update Riders',
      key: 'update_riders',
      description: 'Allows updating rider details',
      group: 'rider_management',
    },
    {
      name: 'Delete Riders',
      key: 'delete_riders',
      description: 'Allows removing riders',
      group: 'rider_management',
    },
  
    // Payment Management Permissions
    {
      name: 'View Payments',
      key: 'view_payments',
      description: 'Allows viewing payment transactions',
      group: 'payment_management',
    },
    {
      name: 'Create Payment',
      key: 'create_payment',
      description: 'Allows creating payment transactions',
      group: 'payment_management',
    },
    {
      name: 'Process Refunds',
      key: 'process_refunds',
      description: 'Allows processing refunds',
      group: 'payment_management',
    },
    {
      name: 'View All Payments',
      key: 'view_all_payments',
      description: 'Allows viewing all payment transactions',
      group: 'payment_management',
    },
  
    // Review Management Permissions
    {
      name: 'View Reviews',
      key: 'view_reviews',
      description: 'Allows viewing customer reviews',
      group: 'review_management',
    },
    {
      name: 'Create Reviews',
      key: 'create_reviews',
      description: 'Allows creating reviews',
      group: 'review_management',
    },
    {
      name: 'Moderate Reviews',
      key: 'moderate_reviews',
      description: 'Allows moderating and managing reviews',
      group: 'review_management',
    },
  
    // Notification Permissions
    {
      name: 'View Notifications',
      key: 'view_notifications',
      description: 'Allows viewing notifications',
      group: 'notification_management',
    },
    {
      name: 'Send Notifications',
      key: 'send_notifications',
      description: 'Allows sending notifications to users',
      group: 'notification_management',
    },
  
    // System Settings Permissions
    {
      name: 'Manage Settings',
      key: 'manage_settings',
      description: 'Allows changing system configurations',
      group: 'system_settings',
    },
    {
      name: 'View Reports',
      key: 'view_reports',
      description: 'Allows viewing system reports and analytics',
      group: 'system_settings',
    },
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
        'view_users',
        'create_users',
        'update_users',
        'delete_users',
        'manage_roles',
        // Order Management (full)
        'view_orders',
        'view_all_orders',
        'create_orders',
        'update_orders',
        'cancel_orders',
        // Delivery Management (full)
        'view_deliveries',
        'view_all_deliveries',
        'assign_deliveries',
        'update_delivery_status',
        // Partner Management (full)
        'view_partners',
        'view_all_partners',
        'create_partners',
        'update_partners',
        'delete_partners',
        'manage_menu',
        // Rider Management (full)
        'view_riders',
        'create_riders',
        'update_riders',
        'delete_riders',
        // Payment Management (full)
        'view_payments',
        'view_all_payments',
        'process_refunds',
        // Review Management
        'view_reviews',
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
        'view_orders',
        'update_orders',
        'cancel_orders',
        // Partner Management (own profile only)
        'view_partners',
        'update_partners',
        'manage_menu',
        // Payments (view own)
        'view_payments',
        // Reviews (view own)
        'view_reviews',
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
        'view_orders',
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
        'view_orders',
        'create_orders',
        'cancel_orders',
        // Payments (own payments)
        'view_payments',
        'create_payment',
        // Reviews
        'view_reviews',
        'create_reviews',
        // Notifications
        'view_notifications',
      ],
    },
  ];
  
