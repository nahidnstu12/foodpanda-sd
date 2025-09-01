import { 
    SquareTerminal, Bot, BookOpen, Settings2, 
    Frame, PieChart, Map, Users, Shield, Database,
    Truck, Store, ShoppingCart, UserCheck
  } from 'lucide-react';
  
  export interface MenuItem {
    id: string;
    title: string;
    url: string;
    icon?: any;
    isActive?: boolean;
    permissions: string[]; // Using your permission keys
    items?: MenuItem[];
  }
  
  export const allMenus: MenuItem[] = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      url: '/dashboard',
      icon: PieChart,
      permissions: ['view_orders'], // Any order permission gives dashboard access
      items: [
        { 
          id: 'overview', 
          title: 'Overview', 
          url: '/dashboard', 
          permissions: ['view_orders'] 
        },
        { 
          id: 'analytics', 
          title: 'Analytics', 
          url: '/dashboard/analytics', 
          permissions: ['view_orders'] 
        }
      ]
    },
    
    {
      id: 'orders',
      title: 'Orders',
      url: '/orders',
      icon: ShoppingCart,
      permissions: ['view_orders'],
      items: [
        { 
          id: 'all-orders', 
          title: 'All Orders', 
          url: '/orders', 
          permissions: ['view_orders'] 
        },
        { 
          id: 'update-orders', 
          title: 'Update Orders', 
          url: '/orders/update', 
          permissions: ['update_orders'] 
        },
        { 
          id: 'cancel-orders', 
          title: 'Cancel Orders', 
          url: '/orders/cancel', 
          permissions: ['cancel_orders'] 
        }
      ]
    },
    
    {
      id: 'partners',
      title: 'Partners',
      url: '/partners',
      icon: Store,
      permissions: ['view_partners'],
      items: [
        { 
          id: 'all-partners', 
          title: 'All Partners', 
          url: '/partners', 
          permissions: ['view_partners'] 
        },
        { 
          id: 'update-partners', 
          title: 'Update Partners', 
          url: '/partners/update', 
          permissions: ['update_partners'] 
        }
      ]
    },
    
    {
      id: 'menu',
      title: 'Menu Management',
      url: '/menu',
      icon: BookOpen,
      permissions: ['manage_menu'],
      items: [
        { 
          id: 'all-menus', 
          title: 'All Menus', 
          url: '/menu', 
          permissions: ['manage_menu'] 
        },
        { 
          id: 'create-menu', 
          title: 'Create Menu', 
          url: '/menu/create', 
          permissions: ['manage_menu'] 
        }
      ]
    },
    
    {
      id: 'payments',
      title: 'Payments',
      url: '/payments',
      icon: Shield,
      permissions: ['view_payments'],
      items: [
        { 
          id: 'all-payments', 
          title: 'All Payments', 
          url: '/payments', 
          permissions: ['view_payments'] 
        }
      ]
    }
  ];