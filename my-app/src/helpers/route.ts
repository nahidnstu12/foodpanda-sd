export const publicRoutes = ['/login', '/signup', '/forgot-password', '/verify-email'];
export const dashboardRoutes = {
  '/dashboard/super-admin': ['SUPER_ADMIN'],
  '/dashboard/admin': ['SUPER_ADMIN', 'ADMIN'],
  '/dashboard/partner': ['SUPER_ADMIN', 'ADMIN', 'PARTNER'],
  '/dashboard/rider': ['SUPER_ADMIN', 'ADMIN', 'RIDER'],
  '/dashboard/customer': ['SUPER_ADMIN', 'ADMIN', 'CUSTOMER', 'PARTNER', 'RIDER'],
};