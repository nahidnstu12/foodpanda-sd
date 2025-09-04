import {
  BarChart3,
  BookOpen,
  CreditCard,
  Home,
  MapPin,
  Menu,
  PieChart,
  Settings,
  Shield,
  ShoppingCart,
  Store,
  Truck,
  Users,
  UserCheck,
  Bell,
  HelpCircle,
  Star,
  Wallet,
} from "lucide-react";

export interface MenuItem {
  id: string;
  title: string;
  url: string;
  icon?: any;
  isActive?: boolean;
  permissions: string[]; // Using your permission keys
  items?: MenuItem[];
  roles?: string[]; // Specific roles that can access this menu
}

export const allMenus: MenuItem[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    url: "/dashboard",
    icon: PieChart,
    permissions: [],
    items: [
      {
        id: "overview",
        title: "Overview",
        url: "/dashboard",
        permissions: ["view_orders"],
      },
      {
        id: "analytics",
        title: "Analytics",
        url: "/dashboard/analytics",
        permissions: ["view_orders"],
      },
    ],
  },
  // {
  //   id: "user_management",
  //   title: "User Management",
  //   url: "",
  //   permissions: [],
  //   items: [
  //     {
  //       id: "permissions",
  //       title: "Permissions",
  //       url: "/admin/permissions",
  //       permissions: [],
  //     },
  //     {
  //       id: "roles",
  //       title: "Roles",
  //       url: "/admin/roles",
  //       permissions: [],
  //     },
  //     {
  //       id: "users",
  //       title: "Users",
  //       url: "/admin/users",
  //       permissions: [],
  //     },
  //   ],
  // },
  // {
  //   id: "partner_management",
  //   title: "Partner Management",
  //   url: "",
  //   permissions: [],
  //   items: [
  //     {
  //       id: "partners",
  //       title: "Partners",
  //       url: "/admin/partners",
  //       permissions: [],
  //     },
  //   ],
  // },
  // {
  //   id: "rider_management",
  //   title: "Rider Management",
  //   url: "",
  //   permissions: [],
  //   items: [
  //     {
  //       id: "riders",
  //       title: "Riders",
  //       url: "/admin/riders",
  //       permissions: [],
  //     },
  //   ],
  // },
  // {
  //   id: "menu_management",
  //   title: "Menu Management",
  //   url: "",
  //   permissions: [],
  //   items: [
  //     {
  //       id: "menus",
  //       title: "Menus",
  //       url: "/admin/menus",
  //       permissions: [],
  //     },
  //   ],
  // },
  // {
  //   id: "restaurant_management",
  //   title: "Restaurant Management",
  //   url: "",
  //   permissions: [],
  //   items: [
  //     {
  //       id: "restaurants",
  //       title: "Restaurants",
  //       url: "/admin/restaurants",
  //       permissions: [],
  //     },
  //   ],
  // },

  {
    id: "orders",
    title: "Orders",
    url: "/orders",
    icon: ShoppingCart,
    permissions: [],
    items: [
      {
        id: "all-orders",
        title: "All Orders",
        url: "/orders",
        permissions: ["view_orders"],
      },
    ],
  },

  {
    id: "payments",
    title: "Payments",
    url: "/payments",
    icon: Shield,
    permissions: [],
    items: [
      {
        id: "all-payments",
        title: "All Payments",
        url: "/payments",
        permissions: ["view_payments"],
      },
    ],
  },
];

//   // Menu Interface
//   export interface MenuItem {
//     id: string;
//     title: string;
//     url: string;
//     icon?: any;
//     isActive?: boolean;
//     permissions: string[];
//     items?: MenuItem[];
//     roles?: string[]; // Specific roles that can access this menu
//   }

//   // Comprehensive Menu System for All User Types
export const adminMenus: MenuItem[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: PieChart,
    permissions: ["view_dashboard"],
    roles: ["SUPER_ADMIN", "ADMIN"],
    items: [],
  },
  {
    id: "user_management",
    title: "User Management",
    url: "",
    icon: Users,
    permissions: ["view_users"],
    roles: ["SUPER_ADMIN", "ADMIN"],
    items: [
      {
        id: "users",
        title: "All Users",
        url: "/admin/users",
        permissions: ["view_users"],
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        id: "roles",
        title: "Roles & Permissions",
        url: "/admin/roles",
        permissions: ["manage_roles"],
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
    ],
  },
  {
    id: "partner_management",
    title: "Partner Management",
    url: "",
    icon: Store,
    permissions: ["view_all_partners"],
    roles: ["SUPER_ADMIN", "ADMIN"],
    items: [
      {
        id: "partners",
        title: "All Partners",
        url: "/admin/partners",
        permissions: ["view_all_partners"],
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        id: "partner_onboarding",
        title: "Partner Onboarding",
        url: "/admin/partners/onboard",
        permissions: ["create_partners"],
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        id: "restaurants",
        title: "Restaurants",
        url: "/admin/restaurants",
        permissions: ["view_all_partners"],
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        id: "menus",
        title: "Menu Management",
        url: "/admin/menus",
        permissions: ["manage_menu"],
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
    ],
  },
  {
    id: "rider_management",
    title: "Rider Management",
    url: "",
    icon: Truck,
    permissions: ["view_riders"],
    roles: ["SUPER_ADMIN", "ADMIN"],
    items: [
      {
        id: "riders",
        title: "All Riders",
        url: "/admin/riders",
        permissions: ["view_riders"],
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        id: "rider_onboarding",
        title: "Rider Onboarding",
        url: "/admin/riders/onboard",
        permissions: ["create_riders"],
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
    ],
  },
  {
    id: "orders",
    title: "Order Management",
    url: "",
    icon: ShoppingCart,
    permissions: ["view_all_orders"],
    roles: ["SUPER_ADMIN", "ADMIN"],
    items: [
      {
        id: "all-orders",
        title: "All Orders",
        url: "/admin/orders",
        permissions: ["view_all_orders"],
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        id: "order-tracking",
        title: "Order Tracking",
        url: "/admin/orders/tracking",
        permissions: ["view_all_orders"],
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
    ],
  },
  {
    id: "deliveries",
    title: "Delivery Management",
    url: "",
    icon: MapPin,
    permissions: ["view_all_deliveries"],
    roles: ["SUPER_ADMIN", "ADMIN"],
    items: [
      {
        id: "all-deliveries",
        title: "All Deliveries",
        url: "/admin/deliveries",
        permissions: ["view_all_deliveries"],
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        id: "delivery-assignment",
        title: "Delivery Assignment",
        url: "/admin/deliveries/assign",
        permissions: ["assign_deliveries"],
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
    ],
  },
  {
    id: "payments",
    title: "Payment Management",
    url: "",
    icon: CreditCard,
    permissions: ["view_all_payments"],
    roles: ["SUPER_ADMIN", "ADMIN"],
    items: [
      {
        id: "all-payments",
        title: "All Payments",
        url: "/admin/payments",
        permissions: ["view_all_payments"],
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        id: "refunds",
        title: "Refunds",
        url: "/admin/payments/refunds",
        permissions: ["process_refunds"],
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
    ],
  },
  {
    id: "reviews",
    title: "Review Management",
    url: "/admin/reviews",
    icon: Star,
    permissions: ["moderate_reviews"],
    roles: ["SUPER_ADMIN", "ADMIN"],
  },
  {
    id: "notifications",
    title: "Notifications",
    url: "/admin/notifications",
    icon: Bell,
    permissions: ["send_notifications"],
    roles: ["SUPER_ADMIN", "ADMIN"],
  },
  {
    id: "reports",
    title: "Reports & Analytics",
    url: "/admin/reports",
    icon: BarChart3,
    permissions: ["view_reports"],
    roles: ["SUPER_ADMIN", "ADMIN"],
  },
  {
    id: "settings",
    title: "System Settings",
    url: "/admin/settings",
    icon: Settings,
    permissions: ["manage_settings"],
    roles: ["SUPER_ADMIN"],
  },
];

export const partnerMenus: MenuItem[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    url: "/partner/dashboard",
    icon: Home,
    permissions: ["view_dashboard"],
    roles: ["PARTNER"],
  },
  {
    id: "menu_management",
    title: "Menu Management",
    url: "",
    icon: Menu,
    permissions: ["manage_menu"],
    roles: ["PARTNER"],
    items: [
      {
        id: "my-menu",
        title: "My Menu",
        url: "/partner/menu",
        permissions: ["manage_menu"],
        roles: ["PARTNER"],
      },
      {
        id: "menu-categories",
        title: "Categories",
        url: "/partner/menu/categories",
        permissions: ["manage_menu"],
        roles: ["PARTNER"],
      },
      {
        id: "menu-items",
        title: "Menu Items",
        url: "/partner/menu/items",
        permissions: ["manage_menu"],
        roles: ["PARTNER"],
      },
    ],
  },
  {
    id: "orders",
    title: "Orders",
    url: "",
    icon: ShoppingCart,
    permissions: ["view_orders"],
    roles: ["PARTNER"],
    items: [
      {
        id: "active-orders",
        title: "Active Orders",
        url: "/partner/orders/active",
        permissions: ["view_orders"],
        roles: ["PARTNER"],
      },
      {
        id: "order-history",
        title: "Order History",
        url: "/partner/orders/history",
        permissions: ["view_orders"],
        roles: ["PARTNER"],
      },
    ],
  },
  {
    id: "restaurant",
    title: "Restaurant Profile",
    url: "/partner/restaurant",
    icon: Store,
    permissions: ["update_partners"],
    roles: ["PARTNER"],
  },
  {
    id: "earnings",
    title: "Earnings",
    url: "/partner/earnings",
    icon: Wallet,
    permissions: ["view_payments"],
    roles: ["PARTNER"],
  },
  {
    id: "reviews",
    title: "Reviews",
    url: "/partner/reviews",
    icon: Star,
    permissions: ["view_reviews"],
    roles: ["PARTNER"],
  },
  {
    id: "notifications",
    title: "Notifications",
    url: "/partner/notifications",
    icon: Bell,
    permissions: ["view_notifications"],
    roles: ["PARTNER"],
  },
];

export const riderMenus: MenuItem[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    url: "/rider/dashboard",
    icon: Home,
    permissions: ["view_dashboard"],
    roles: ["RIDER"],
  },
  {
    id: "deliveries",
    title: "Deliveries",
    url: "",
    icon: Truck,
    permissions: ["view_deliveries"],
    roles: ["RIDER"],
    items: [
      {
        id: "active-deliveries",
        title: "Active Deliveries",
        url: "/rider/deliveries/active",
        permissions: ["view_deliveries"],
        roles: ["RIDER"],
      },
      {
        id: "delivery-history",
        title: "Delivery History",
        url: "/rider/deliveries/history",
        permissions: ["view_deliveries"],
        roles: ["RIDER"],
      },
    ],
  },
  {
    id: "orders",
    title: "Orders",
    url: "/rider/orders",
    icon: ShoppingCart,
    permissions: ["view_orders"],
    roles: ["RIDER"],
  },
  {
    id: "earnings",
    title: "Earnings",
    url: "/rider/earnings",
    icon: Wallet,
    permissions: ["view_payments"],
    roles: ["RIDER"],
  },
  {
    id: "profile",
    title: "My Profile",
    url: "/rider/profile",
    icon: UserCheck,
    permissions: ["view_notifications"],
    roles: ["RIDER"],
  },
  {
    id: "notifications",
    title: "Notifications",
    url: "/rider/notifications",
    icon: Bell,
    permissions: ["view_notifications"],
    roles: ["RIDER"],
  },
];

export const customerMenus: MenuItem[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    url: "/customer/dashboard",
    icon: Home,
    permissions: ["view_dashboard"],
    roles: ["CUSTOMER"],
  },
  {
    id: "browse",
    title: "Browse Restaurants",
    url: "/customer/restaurants",
    icon: Store,
    permissions: ["create_orders"],
    roles: ["CUSTOMER"],
  },
  {
    id: "orders",
    title: "My Orders",
    url: "",
    icon: ShoppingCart,
    permissions: ["view_orders"],
    roles: ["CUSTOMER"],
    items: [
      {
        id: "active-orders",
        title: "Active Orders",
        url: "/customer/orders/active",
        permissions: ["view_orders"],
        roles: ["CUSTOMER"],
      },
      {
        id: "order-history",
        title: "Order History",
        url: "/customer/orders/history",
        permissions: ["view_orders"],
        roles: ["CUSTOMER"],
      },
    ],
  },
  {
    id: "payments",
    title: "Payment Methods",
    url: "/customer/payments",
    icon: CreditCard,
    permissions: ["view_payments"],
    roles: ["CUSTOMER"],
  },
  {
    id: "reviews",
    title: "My Reviews",
    url: "/customer/reviews",
    icon: Star,
    permissions: ["create_reviews"],
    roles: ["CUSTOMER"],
  },
  {
    id: "profile",
    title: "My Profile",
    url: "/customer/profile",
    icon: UserCheck,
    permissions: ["view_notifications"],
    roles: ["CUSTOMER"],
  },
  {
    id: "notifications",
    title: "Notifications",
    url: "/customer/notifications",
    icon: Bell,
    permissions: ["view_notifications"],
    roles: ["CUSTOMER"],
  },
  {
    id: "help",
    title: "Help & Support",
    url: "/customer/help",
    icon: HelpCircle,
    permissions: ["view_notifications"],
    roles: ["CUSTOMER"],
  },
];



//   // Comprehensive Route Configuration
//   export const ROUTE_CONFIG: Record<string, RouteConfig> = {
//     // Admin Routes
//     "/admin/dashboard": { permissions: ["view_dashboard"], roles: ["SUPER_ADMIN", "ADMIN"] },
//     "/admin/users": { permissions: ["view_users"], roles: ["SUPER_ADMIN", "ADMIN"] },
//     "/admin/roles": { permissions: ["manage_roles"], roles: ["SUPER_ADMIN", "ADMIN"] },
//     "/admin/partners": { permissions: ["view_all_partners"], roles: ["SUPER_ADMIN", "ADMIN"] },
//     "/admin/partners/onboard": { permissions: ["create_partners"], roles: ["SUPER_ADMIN", "ADMIN"] },
//     "/admin/restaurants": { permissions: ["view_all_partners"], roles: ["SUPER_ADMIN", "ADMIN"] },
//     "/admin/menus": { permissions: ["manage_menu"], roles: ["SUPER_ADMIN", "ADMIN"] },
//     "/admin/riders": { permissions: ["view_riders"], roles: ["SUPER_ADMIN", "ADMIN"] },
//     "/admin/riders/onboard": { permissions: ["create_riders"], roles: ["SUPER_ADMIN", "ADMIN"] },
//     "/admin/orders": { permissions: ["view_all_orders"], roles: ["SUPER_ADMIN", "ADMIN"] },
//     "/admin/orders/tracking": { permissions: ["view_all_orders"], roles: ["SUPER_ADMIN", "ADMIN"] },
//     "/admin/deliveries": { permissions: ["view_all_deliveries"], roles: ["SUPER_ADMIN", "ADMIN"] },
//     "/admin/deliveries/assign": { permissions: ["assign_deliveries"], roles: ["SUPER_ADMIN", "ADMIN"] },
//     "/admin/payments": { permissions: ["view_all_payments"], roles: ["SUPER_ADMIN", "ADMIN"] },
//     "/admin/payments/refunds": { permissions: ["process_refunds"], roles: ["SUPER_ADMIN", "ADMIN"] },
//     "/admin/reviews": { permissions: ["moderate_reviews"], roles: ["SUPER_ADMIN", "ADMIN"] },
//     "/admin/notifications": { permissions: ["send_notifications"], roles: ["SUPER_ADMIN", "ADMIN"] },
//     "/admin/reports": { permissions: ["view_reports"], roles: ["SUPER_ADMIN", "ADMIN"] },
//     "/admin/settings": { permissions: ["manage_settings"], roles: ["SUPER_ADMIN"] },

//     // Partner Routes
//     "/partner/dashboard": { permissions: ["view_dashboard"], roles: ["PARTNER"] },
//     "/partner/menu": { permissions: ["manage_menu"], roles: ["PARTNER"] },
//     "/partner/menu/categories": { permissions: ["manage_menu"], roles: ["PARTNER"] },
//     "/partner/menu/items": { permissions: ["manage_menu"], roles: ["PARTNER"] },
//     "/partner/orders/active": { permissions: ["view_orders"], roles: ["PARTNER"] },
//     "/partner/orders/history": { permissions: ["view_orders"], roles: ["PARTNER"] },
//     "/partner/restaurant": { permissions: ["update_partners"], roles: ["PARTNER"] },
//     "/partner/earnings": { permissions: ["view_payments"], roles: ["PARTNER"] },
//     "/partner/reviews": { permissions: ["view_reviews"], roles: ["PARTNER"] },
//     "/partner/notifications": { permissions: ["view_notifications"], roles: ["PARTNER"] },

//     // Rider Routes
//     "/rider/dashboard": { permissions: ["view_dashboard"], roles: ["RIDER"] },
//     "/rider/deliveries/active": { permissions: ["view_deliveries"], roles: ["RIDER"] },
//     "/rider/deliveries/history": { permissions: ["view_deliveries"], roles: ["RIDER"] },
//     "/rider/orders": { permissions: ["view_orders"], roles: ["RIDER"] },
//     "/rider/earnings": { permissions: ["view_payments"], roles: ["RIDER"] },
//     "/rider/profile": { permissions: ["view_notifications"], roles: ["RIDER"] },
//     "/rider/notifications": { permissions: ["view_notifications"], roles: ["RIDER"] },

//     // Customer Routes
//     "/customer/dashboard": { permissions: ["view_dashboard"], roles: ["CUSTOMER"] },
//     "/customer/restaurants": { permissions: ["create_orders"], roles: ["CUSTOMER"] },
//     "/customer/orders/active": { permissions: ["view_orders"], roles: ["CUSTOMER"] },
//     "/customer/orders/history": { permissions: ["view_orders"], roles: ["CUSTOMER"] },
//     "/customer/payments": { permissions: ["view_payments"], roles: ["CUSTOMER"] },
//     "/customer/reviews": { permissions: ["create_reviews"], roles: ["CUSTOMER"] },
//     "/customer/profile": { permissions: ["view_notifications"], roles: ["CUSTOMER"] },
//     "/customer/notifications": { permissions: ["view_notifications"], roles: ["CUSTOMER"] },
//     "/customer/help": { permissions: ["view_notifications"], roles: ["CUSTOMER"] },
//   };

//   // Utility function to get menus based on user role
export const getMenusByRole = (userRole: string): MenuItem[] => {
  switch (userRole) {
    case "SUPER_ADMIN":
    case "ADMIN":
      return adminMenus;
    case "PARTNER":
      return partnerMenus;
    case "RIDER":
      return riderMenus;
    case "CUSTOMER":
      return customerMenus;
    default:
      return [];
  }
};

//   // Utility function to check if user has access to a route
//   export const hasRouteAccess = (
//     route: string,
//     userPermissions: string[],
//     userRole: string
//   ): boolean => {
//     const routeConfig = ROUTE_CONFIG[route];
//     if (!routeConfig) return false;

//     // Check role restriction first
//     if (routeConfig.roles && !routeConfig.roles.includes(userRole)) {
//       return false;
//     }

//     // Check permissions
//     const { permissions, mode = "ANY" } = routeConfig;

//     if (mode === "ALL") {
//       return permissions.every(permission => userPermissions.includes(permission));
//     } else {
//       return permissions.some(permission => userPermissions.includes(permission));
//     }
//   };

//   // Utility function to filter menu items based on user permissions and role
//   export const filterMenuByPermissions = (
//     menuItems: MenuItem[],
//     userPermissions: string[],
//     userRole: string
//   ): MenuItem[] => {
//     return menuItems.filter(item => {
//       // Check role restriction
//       if (item.roles && !item.roles.includes(userRole)) {
//         return false;
//       }

//       // Check permissions (if any are required)
//       if (item.permissions.length > 0) {
//         const hasPermission = item.permissions.some(permission =>
//           userPermissions.includes(permission)
//         );
//         if (!hasPermission) return false;
//       }

//       // Filter sub-items if they exist
//       if (item.items) {
//         item.items = filterMenuByPermissions(item.items, userPermissions, userRole);
//         // Keep parent item if it has accessible sub-items or no permission requirements
//         return item.items.length > 0 || item.permissions.length === 0;
//       }

//       return true;
//     });
//   };
