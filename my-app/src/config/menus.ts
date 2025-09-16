import {
  BarChart3,
  Bell,
  CreditCard,
  HelpCircle,
  Home,
  MapPin,
  Menu,
  PieChart,
  Settings,
  ShoppingCart,
  Star,
  Store,
  Truck,
  UserCheck,
  Users,
  Wallet,
} from "lucide-react";
import { ROUTES } from "./browser-route";
import { PERMISSIONS } from "./permissions";

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

export const adminMenus: MenuItem[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    url: ROUTES.Admin.Dashboard,
    icon: PieChart,
    permissions: [PERMISSIONS.VIEW_DASHBOARD],
    roles: ["SUPER_ADMIN", "ADMIN"],
  },
  {
    id: "user_management",
    title: "User Management",
    icon: Users,
    url: "",
    permissions: [],
    roles: ["SUPER_ADMIN", "ADMIN"],
    items: [
      {
        id: "users",
        title: "Users",
        url: ROUTES.Admin.Users,
        permissions: [PERMISSIONS.VIEW_USER],
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        id: "permissions",
        title: "Permissions",
        url: ROUTES.Admin.Permissions,
        permissions: [PERMISSIONS.VIEW_PERMISSION],
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        id: "roles",
        title: "Roles",
        url: ROUTES.Admin.Roles,
        permissions: [PERMISSIONS.MANAGE_ROLES],
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
    ],
  },
  {
    id: "partner_management",
    title: "Partner Management",
    icon: Store,
    url: "",
    permissions: [PERMISSIONS.VIEW_PARTNER],
    roles: ["SUPER_ADMIN", "ADMIN"],
    items: [
      {
        id: "partners",
        title: "Partners",
        url: ROUTES.Admin.Partners,
        permissions: [PERMISSIONS.VIEW_PARTNER],
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        id: "partner_onboarding",
        title: "Partner Onboarding",
        url: ROUTES.Admin.PartnersOnboard,
        permissions: [PERMISSIONS.CREATE_PARTNER],
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        id: "restaurants",
        title: "Restaurants",
        url: ROUTES.Admin.Restaurants,
        permissions: [PERMISSIONS.VIEW_PARTNER],
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        id: "menus",
        title: "Menu Management",
        url: ROUTES.Admin.Menus,
        permissions: [PERMISSIONS.MANAGE_MENU],
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
    ],
  },
  {
    id: "rider_management",
    title: "Rider Management",
    icon: Truck,
    url: "",
    permissions: [PERMISSIONS.VIEW_RIDER],
    roles: ["SUPER_ADMIN", "ADMIN"],
    items: [
      {
        id: "riders",
        title: "Riders",
        url: ROUTES.Admin.Riders,
        permissions: [PERMISSIONS.VIEW_RIDER],
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        id: "rider_onboarding",
        title: "Rider Onboarding",
        url: ROUTES.Admin.RidersOnboard,
        permissions: [PERMISSIONS.CREATE_RIDER],
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
    ],
  },
  {
    id: "orders",
    title: "Order Management",
    icon: ShoppingCart,
    url: "",
    permissions: [PERMISSIONS.VIEW_ORDER],
    roles: ["SUPER_ADMIN", "ADMIN"],
    items: [
      {
        id: "all-orders",
        title: "Orders",
        url: ROUTES.Admin.Orders,
        permissions: [PERMISSIONS.VIEW_ORDER],
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        id: "order-tracking",
        title: "Order Tracking",
        url: ROUTES.Admin.OrdersTracking,
        permissions: [PERMISSIONS.VIEW_ORDER],
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
    ],
  },
  {
    id: "deliveries",
    title: "Delivery Management",
    icon: MapPin,
    url: "",
    permissions: [PERMISSIONS.VIEW_ALL_DELIVERIES],
    roles: ["SUPER_ADMIN", "ADMIN"],
    items: [
      {
        id: "all-deliveries",
        title: "Deliveries",
        url: ROUTES.Admin.Deliveries,
        permissions: [PERMISSIONS.VIEW_ALL_DELIVERIES],
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        id: "delivery-assignment",
        title: "Delivery Assignment",
        url: ROUTES.Admin.DeliveriesAssign,
        permissions: [PERMISSIONS.ASSIGN_DELIVERIES],
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
    ],
  },
  {
    id: "payments",
    title: "Payment Management",
    icon: CreditCard,
    url: "",
    permissions: [PERMISSIONS.VIEW_PAYMENTS],
    roles: ["SUPER_ADMIN", "ADMIN"],
    items: [
      {
        id: "all-payments",
        title: "Payments",
        url: ROUTES.Admin.Payments,
        permissions: [PERMISSIONS.VIEW_PAYMENTS],
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        id: "refunds",
        title: "Refunds",
        url: ROUTES.Admin.PaymentsRefunds,
        permissions: [PERMISSIONS.PROCESS_REFUND],
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
    ],
  },
  {
    id: "reviews",
    title: "Review Management",
    url: ROUTES.Admin.Reviews,
    icon: Star,
    permissions: [PERMISSIONS.MODERATE_REVIEWS],
    roles: ["SUPER_ADMIN", "ADMIN"],
  },
  {
    id: "notifications",
    title: "Notifications",
    url: ROUTES.Admin.Notifications,
    icon: Bell,
    permissions: [PERMISSIONS.SEND_NOTIFICATIONS],
    roles: ["SUPER_ADMIN", "ADMIN"],
  },
  {
    id: "reports",
    title: "Reports & Analytics",
    url: ROUTES.Admin.Reports,
    icon: BarChart3,
    permissions: [PERMISSIONS.VIEW_REPORTS],
    roles: ["SUPER_ADMIN", "ADMIN"],
  },
  {
    id: "settings",
    title: "System Settings",
    url: ROUTES.Admin.Settings,
    icon: Settings,
    permissions: [PERMISSIONS.MANAGE_SETTINGS],
    roles: ["SUPER_ADMIN"],
  },
];

export const partnerMenus: MenuItem[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    url: ROUTES.Partner.Dashboard,
    icon: Home,
    permissions: [PERMISSIONS.VIEW_DASHBOARD],
    roles: ["PARTNER"],
  },
  {
    id: "menu_management",
    title: "Menu Management",
    icon: Menu,
    url: "",
    permissions: [PERMISSIONS.MANAGE_MENU],
    roles: ["PARTNER"],
    items: [
      {
        id: "my-menu",
        title: "My Menu",
        url: ROUTES.Partner.Menu,
        permissions: [PERMISSIONS.MANAGE_MENU],
        roles: ["PARTNER"],
      },
      {
        id: "menu-categories",
        title: "Categories",
        url: ROUTES.Partner.MenuCategories,
        permissions: [PERMISSIONS.MANAGE_MENU],
        roles: ["PARTNER"],
      },
      {
        id: "menu-items",
        title: "Menu Items",
        url: ROUTES.Partner.MenuItems,
        permissions: [PERMISSIONS.MANAGE_MENU],
        roles: ["PARTNER"],
      },
    ],
  },
  {
    id: "orders",
    title: "Orders",
    icon: ShoppingCart,
    url: "",
    permissions: [PERMISSIONS.VIEW_ORDER],
    roles: ["PARTNER"],
    items: [
      {
        id: "active-orders",
        title: "Active Orders",
        url: ROUTES.Partner.OrdersActive,
        permissions: [PERMISSIONS.VIEW_ORDER],
        roles: ["PARTNER"],
      },
      {
        id: "order-history",
        title: "Order History",
        url: ROUTES.Partner.OrdersHistory,
        permissions: [PERMISSIONS.VIEW_ORDER],
        roles: ["PARTNER"],
      },
    ],
  },
  {
    id: "restaurant",
    title: "Restaurant Profile",
    url: ROUTES.Partner.Restaurant,
    icon: Store,
    permissions: [PERMISSIONS.UPDATE_PARTNER],
    roles: ["PARTNER"],
  },
  {
    id: "earnings",
    title: "Earnings",
    url: ROUTES.Partner.Earnings,
    icon: Wallet,
    permissions: [PERMISSIONS.VIEW_PAYMENTS],
    roles: ["PARTNER"],
  },
  {
    id: "reviews",
    title: "Reviews",
    url: ROUTES.Partner.Reviews,
    icon: Star,
    permissions: [PERMISSIONS.VIEW_REVIEW],
    roles: ["PARTNER"],
  },
  {
    id: "notifications",
    title: "Notifications",
    url: ROUTES.Partner.Notifications,
    icon: Bell,
    permissions: [PERMISSIONS.VIEW_NOTIFICATIONS],
    roles: ["PARTNER"],
  },
];

export const riderMenus: MenuItem[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    url: ROUTES.Rider.Dashboard,
    icon: Home,
    permissions: [PERMISSIONS.VIEW_DASHBOARD],
    roles: ["RIDER"],
  },
  {
    id: "deliveries",
    title: "Deliveries",
    icon: Truck,
    url: "",
    permissions: [PERMISSIONS.VIEW_DELIVERIES],
    roles: ["RIDER"],
    items: [
      {
        id: "active-deliveries",
        title: "Active Deliveries",
        url: ROUTES.Rider.DeliveriesActive,
        permissions: [PERMISSIONS.VIEW_DELIVERIES],
        roles: ["RIDER"],
      },
      {
        id: "delivery-history",
        title: "Delivery History",
        url: ROUTES.Rider.DeliveriesHistory,
        permissions: [PERMISSIONS.VIEW_DELIVERIES],
        roles: ["RIDER"],
      },
    ],
  },
  {
    id: "orders",
    title: "Orders",
    url: ROUTES.Rider.Orders,
    icon: ShoppingCart,
    permissions: [PERMISSIONS.VIEW_ORDER],
    roles: ["RIDER"],
  },
  {
    id: "earnings",
    title: "Earnings",
    url: ROUTES.Rider.Earnings,
    icon: Wallet,
    permissions: [PERMISSIONS.VIEW_PAYMENTS],
    roles: ["RIDER"],
  },
  {
    id: "profile",
    title: "My Profile",
    url: ROUTES.Rider.Profile,
    icon: UserCheck,
    permissions: [PERMISSIONS.VIEW_NOTIFICATIONS],
    roles: ["RIDER"],
  },
  {
    id: "notifications",
    title: "Notifications",
    url: ROUTES.Rider.Notifications,
    icon: Bell,
    permissions: [PERMISSIONS.VIEW_NOTIFICATIONS],
    roles: ["RIDER"],
  },
];

export const customerMenus: MenuItem[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    url: ROUTES.Customer.Dashboard,
    icon: Home,
    permissions: [PERMISSIONS.VIEW_DASHBOARD],
    roles: ["CUSTOMER"],
  },
  {
    id: "browse",
    title: "Browse Restaurants",
    url: ROUTES.Customer.Restaurants,
    icon: Store,
    permissions: [PERMISSIONS.CREATE_ORDER],
    roles: ["CUSTOMER"],
  },
  {
    id: "orders",
    title: "My Orders",
    icon: ShoppingCart,
    url: "",
    permissions: [PERMISSIONS.VIEW_ORDER],
    roles: ["CUSTOMER"],
    items: [
      {
        id: "active-orders",
        title: "Active Orders",
        url: ROUTES.Customer.OrdersActive,
        permissions: [PERMISSIONS.VIEW_ORDER],
        roles: ["CUSTOMER"],
      },
      {
        id: "order-history",
        title: "Order History",
        url: ROUTES.Customer.OrdersHistory,
        permissions: [PERMISSIONS.VIEW_ORDER],
        roles: ["CUSTOMER"],
      },
    ],
  },
  {
    id: "payments",
    title: "Payment Methods",
    url: ROUTES.Customer.Payments,
    icon: CreditCard,
    permissions: [PERMISSIONS.VIEW_PAYMENTS],
    roles: ["CUSTOMER"],
  },
  {
    id: "reviews",
    title: "My Reviews",
    url: ROUTES.Customer.Reviews,
    icon: Star,
    permissions: [PERMISSIONS.CREATE_REVIEW],
    roles: ["CUSTOMER"],
  },
  {
    id: "profile",
    title: "My Profile",
    url: ROUTES.Customer.Profile,
    icon: UserCheck,
    permissions: [PERMISSIONS.VIEW_NOTIFICATIONS],
    roles: ["CUSTOMER"],
  },
  {
    id: "notifications",
    title: "Notifications",
    url: ROUTES.Customer.Notifications,
    icon: Bell,
    permissions: [PERMISSIONS.VIEW_NOTIFICATIONS],
    roles: ["CUSTOMER"],
  },
  {
    id: "help",
    title: "Help & Support",
    url: ROUTES.Customer.Help,
    icon: HelpCircle,
    permissions: [PERMISSIONS.VIEW_NOTIFICATIONS],
    roles: ["CUSTOMER"],
  },
];
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
