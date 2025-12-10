import { UserStatus } from "../../generated/prisma";
import { UserRole } from "@/helpers/user.enum";

/**
 * User DTOs and Types
 */

export type UserDTO = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: UserStatus;
  emailVerified: boolean;
  isPhoneVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type UserWithRolesDTO = UserDTO & {
  selected_role: string | null;
  roles: string[];
  role_id: string | null;
  customer_profile?: any;
  rider_profile?: any;
  partner_profile?: any;
  admin_profile?: any;
};

export type CreateUserInput = {
  name: string;
  email: string;
  phone?: string | null;
  status: UserStatus;
};

export type UpdateUserInput = {
  name?: string;
  phone?: string | null;
  status?: UserStatus;
};

export type PaginationResult<T> = {
  items: T[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
};

export type ListUsersOptions = {
  page?: number;
  page_size?: number;
  sort?: string;
  order?: "asc" | "desc";
  filters?: Record<string, any>;
  userId?: string; // Current user ID for role-based filtering
};

export type ActionResult<T = any> = {
  success: boolean;
  data?: T;
  message?: string;
};
