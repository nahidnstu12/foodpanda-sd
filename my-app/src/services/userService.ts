import { userRepository } from "@/repositories/userRepository";
import { invalidateUserPermissions } from "@/actions/permissions";
import { buildWhereFromFilters } from "@/lib/datatable";
import type {
  CreateUserInput,
  UpdateUserInput,
  UserWithRolesDTO,
  PaginationResult,
  ListUsersOptions,
  ActionResult,
} from "@/types/user.types";
import { UserRole } from "@/helpers/user.enum";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * User Service - Business Logic Layer
 * Handles all business rules and orchestration for User operations
 */
export class UserService {
  /**
   * Get user roles and profiles
   */
  async getUserRoles(userId: string): Promise<ActionResult<UserWithRolesDTO>> {
    if (!userId) {
      return { success: false, message: "User ID is required" };
    }

    try {
      const user = await userRepository.findByIdWithProfiles(userId);

      if (!user) {
        return { success: false, message: "User not found" };
      }

      // Transform to DTO
      const userData: UserWithRolesDTO = {
        ...user,
        selected_role: user.user_roles?.[0]?.key ?? null,
        roles: user.user_roles?.map((role) => role.key) ?? [],
        role_id: user.user_roles?.[0]?.id ?? null,
      };

      return { success: true, data: userData };
    } catch (error) {
      console.error("Error finding user roles:", error);
      return { success: false, message: "Error finding user roles" };
    }
  }

  /**
   * List users with pagination and role-based filtering
   */
  async listWithPagination(
    options: ListUsersOptions
  ): Promise<PaginationResult<any>> {
    const { userId, ...paginationOptions } = options;

    // Business logic: Apply role-based filtering
    let effectiveWhere: any = paginationOptions.filters
      ? buildWhereFromFilters(paginationOptions.filters)
      : {};

    if (userId) {
      const session = await auth.api.getSession({ headers: await headers() });
      const roles: string[] = (session?.user as any)?.roles ?? [];
      const isAdmin =
        roles?.includes(UserRole.ADMIN) ||
        roles?.includes(UserRole.SUPER_ADMIN);

      // Non-admins can only see users sharing their roles
      if (!isAdmin && roles?.length) {
        const roleScopeFilter = {
          user_roles: { some: { key: { in: roles } } },
        } as const;

        effectiveWhere =
          Object.keys(effectiveWhere).length > 0
            ? { AND: [effectiveWhere, roleScopeFilter] }
            : roleScopeFilter;
      }
    }

    return await userRepository.listWithPagination({
      ...paginationOptions,
      filters: effectiveWhere,
      userId,
    });
  }

  /**
   * Get user by ID
   */
  async getById(userId: string): Promise<ActionResult> {
    if (!userId) {
      return { success: false, message: "User ID is required" };
    }

    try {
      const user = await userRepository.findById(userId);

      if (!user) {
        return { success: false, message: "User not found" };
      }

      return { success: true, data: user };
    } catch (error) {
      console.error("Error getting user:", error);
      return { success: false, message: "Failed to fetch user" };
    }
  }

  /**
   * Create new user
   */
  async create(input: CreateUserInput): Promise<ActionResult> {
    try {
      // Business logic: Check for duplicate email
      const emailExists = await userRepository.emailExists(input.email);
      if (emailExists) {
        return { success: false, message: "Email already exists" };
      }

      // Business logic: Check for duplicate phone if provided
      if (input.phone) {
        const phoneExists = await userRepository.phoneExists(input.phone);
        if (phoneExists) {
          return { success: false, message: "Phone number already exists" };
        }
      }

      const user = await userRepository.create(input);
      return { success: true, data: user };
    } catch (error: any) {
      console.error("Error creating user:", error);

      // Handle Prisma unique constraint errors
      if (error?.code === "P2002") {
        const field = error?.meta?.target?.[0];
        return {
          success: false,
          message: `${
            field ? field.charAt(0).toUpperCase() + field.slice(1) : "Field"
          } already exists`,
        };
      }

      return { success: false, message: "Failed to create user" };
    }
  }

  /**
   * Update user
   */
  async update(userId: string, input: UpdateUserInput): Promise<ActionResult> {
    if (!userId) {
      return { success: false, message: "User ID is required" };
    }

    try {
      // Business logic: Check if user exists
      const existingUser = await userRepository.findById(userId);
      if (!existingUser) {
        return { success: false, message: "User not found" };
      }

      // Note: Email updates should be handled separately if needed
      // For now, UpdateUserInput doesn't include email field

      // Business logic: Check for duplicate phone if changing phone
      if (input.phone && input.phone !== existingUser.phone) {
        const phoneExists = await userRepository.phoneExists(
          input.phone,
          userId
        );
        if (phoneExists) {
          return { success: false, message: "Phone number already exists" };
        }
      }

      const user = await userRepository.update(userId, input);
      return { success: true, data: user };
    } catch (error: any) {
      console.error("Error updating user:", error);

      if (error?.code === "P2002") {
        const field = error?.meta?.target?.[0];
        return {
          success: false,
          message: `${
            field ? field.charAt(0).toUpperCase() + field.slice(1) : "Field"
          } already exists`,
        };
      }

      return { success: false, message: "Failed to update user" };
    }
  }

  /**
   * Delete user
   */
  async delete(userId: string): Promise<ActionResult> {
    if (!userId) {
      return { success: false, message: "User ID is required" };
    }

    try {
      // Business logic: Check if user exists
      const existingUser = await userRepository.findById(userId);
      if (!existingUser) {
        return { success: false, message: "User not found" };
      }

      await userRepository.delete(userId);
      return { success: true };
    } catch (error) {
      console.error("Error deleting user:", error);
      return { success: false, message: "Failed to delete user" };
    }
  }

  /**
   * Get user direct permissions
   */
  async getDirectPermissions(userId: string): Promise<ActionResult<string[]>> {
    if (!userId) {
      return { success: false, message: "User ID is required" };
    }

    try {
      const user = await userRepository.findByIdWithPermissions(userId);
      const permissionIds = (user?.user_permissions ?? []).map(
        (p: any) => p.id
      );
      return { success: true, data: permissionIds };
    } catch (error) {
      console.error("Error getting user permissions:", error);
      return { success: false, message: "Failed to fetch permissions" };
    }
  }

  /**
   * Set user direct permissions
   */
  async setDirectPermissions(
    userId: string,
    permissionIds: string[]
  ): Promise<ActionResult> {
    if (!userId) {
      return { success: false, message: "User ID is required" };
    }

    try {
      await userRepository.setDirectPermissions(userId, permissionIds);

      // Bust permission cache
      await invalidateUserPermissions(userId);

      return { success: true };
    } catch (error) {
      console.error("Error setting user permissions:", error);
      return { success: false, message: "Failed to save permissions" };
    }
  }

  /**
   * Set user role
   */
  async setRole(userId: string, roleId: string): Promise<ActionResult> {
    if (!userId || !roleId) {
      return {
        success: false,
        message: "User ID and Role ID are required",
      };
    }

    try {
      await userRepository.setRole(userId, roleId);

      // Bust permission cache
      await invalidateUserPermissions(userId);

      return { success: true };
    } catch (error) {
      console.error("Error setting user role:", error);
      return { success: false, message: "Failed to set user role" };
    }
  }
}

export const userService = new UserService();
