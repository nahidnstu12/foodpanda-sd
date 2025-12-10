"use server";

import { userService } from "@/services/userService";
import { withActionGuard } from "@/lib/withActionGuard";
import { PERMISSIONS } from "@/config/permissions";
import {
  createUserSchema,
  updateUserSchema,
  userIdSchema,
  paginationSchema,
  permissionIdsSchema,
  roleIdSchema,
  type CreateUserInput,
  type UpdateUserInput,
} from "@/validators/user.validator";
import { sanitizeString, sanitizeEmail, sanitizePhone } from "@/lib/sanitize";
import type { ActionResult, PaginationResult } from "@/types/user.types";

/**
 * Refactored User Actions - Following Layered Architecture
 *
 * Layer: Actions (API Entry Point)
 * Responsibilities:
 * - Input validation & sanitization
 * - Authorization checks
 * - Error handling & formatting
 * - Calling service layer
 */

/**
 * Get user roles and profiles
 */
export async function findUserRoles(userId: unknown): Promise<ActionResult> {
  try {
    // 1. Validate input
    const validatedUserId = userIdSchema.parse(userId);

    // 2. Call service layer
    return await userService.getUserRoles(validatedUserId);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return {
        success: false,
        message: error.issues[0]?.message || "Invalid input",
      };
    }
    console.error("Error in findUserRoles:", error);
    return { success: false, message: "Error finding user roles" };
  }
}

/**
 * List users with pagination
 */
export async function userListWithPagination(
  params: unknown
): Promise<PaginationResult<any>> {
  const result = await withActionGuard(
    "user.list",
    { anyOf: [PERMISSIONS.LIST_USERS, PERMISSIONS.VIEW_USER], audit: true },
    async ({ userId }) => {
      try {
        // 1. Validate input
        const validated = paginationSchema.parse(params);

        // 2. Call service layer
        return await userService.listWithPagination({
          ...validated,
          userId,
        });
      } catch (error: any) {
        if (error.name === "ZodError") {
          throw new Error(
            error.issues[0]?.message || "Invalid pagination parameters"
          );
        }
        throw error;
      }
    }
  );

  if (!result.success) {
    throw new Error(result.message || "Unauthorized");
  }

  return result.data;
}

/**
 * Get user by ID
 */
export async function getUserById(id: unknown): Promise<ActionResult> {
  const result = await withActionGuard(
    "user.get",
    { required: PERMISSIONS.VIEW_USER, audit: true },
    async () => {
      try {
        // 1. Validate input
        const validatedId = userIdSchema.parse(id);

        // 2. Call service layer
        return await userService.getById(validatedId);
      } catch (error: any) {
        if (error.name === "ZodError") {
          return {
            success: false,
            message: error.issues[0]?.message || "Invalid user ID",
          };
        }
        throw error;
      }
    }
  );

  return result;
}

/**
 * Create new user
 */
export async function createUser(input: unknown): Promise<ActionResult> {
  const result = await withActionGuard(
    "user.create",
    { required: PERMISSIONS.CREATE_USER, audit: true },
    async () => {
      try {
        // 1. Validate input
        const validated = createUserSchema.parse(input);

        // 2. Sanitize input
        const sanitized: CreateUserInput = {
          name: sanitizeString(validated.name),
          email: sanitizeEmail(validated.email),
          phone: sanitizePhone(validated.phone),
          status: validated.status,
        };

        // 3. Call service layer
        return await userService.create(sanitized);
      } catch (error: any) {
        if (error.name === "ZodError") {
          return {
            success: false,
            message: error.issues[0]?.message || "Validation failed",
          };
        }
        throw error;
      }
    }
  );

  return result;
}

/**
 * Update user
 */
export async function updateUser(
  id: unknown,
  input: unknown
): Promise<ActionResult> {
  const result = await withActionGuard(
    "user.update",
    { required: PERMISSIONS.UPDATE_USER, audit: true },
    async () => {
      try {
        // 1. Validate inputs
        const validatedId = userIdSchema.parse(id);
        const validated = updateUserSchema.parse(input);

        // 2. Sanitize input
        const sanitized: UpdateUserInput = { phone: null };
        if (validated.name !== undefined) {
          sanitized.name = sanitizeString(validated.name);
        }
        if (validated.phone !== undefined) {
          sanitized.phone = sanitizePhone(validated.phone);
        }
        if (validated.status !== undefined) {
          sanitized.status = validated.status;
        }

        // 3. Call service layer
        return await userService.update(validatedId, sanitized);
      } catch (error: any) {
        if (error.name === "ZodError") {
          return {
            success: false,
            message: error.issues[0]?.message || "Validation failed",
          };
        }
        throw error;
      }
    }
  );

  return result;
}

/**
 * Delete user
 */
export async function deleteUser(id: unknown): Promise<ActionResult> {
  const result = await withActionGuard(
    "user.delete",
    { required: PERMISSIONS.DELETE_USER, audit: true },
    async () => {
      try {
        // 1. Validate input
        const validatedId = userIdSchema.parse(id);

        // 2. Call service layer
        return await userService.delete(validatedId);
      } catch (error: any) {
        if (error.name === "ZodError") {
          return {
            success: false,
            message: error.issues[0]?.message || "Invalid user ID",
          };
        }
        throw error;
      }
    }
  );

  return result;
}

/**
 * Get user direct permissions
 */
export async function getUserDirectPermissions(
  userId: unknown
): Promise<ActionResult<string[]>> {
  try {
    // 1. Validate input
    const validatedUserId = userIdSchema.parse(userId);

    // 2. Call service layer
    return await userService.getDirectPermissions(validatedUserId);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return {
        success: false,
        message: error.issues[0]?.message || "Invalid user ID",
      };
    }
    console.error("Error in getUserDirectPermissions:", error);
    return { success: false, message: "Failed to fetch permissions" };
  }
}

/**
 * Set user direct permissions
 */
export async function setUserDirectPermissions(
  userId: unknown,
  permissionIds: unknown
): Promise<ActionResult> {
  try {
    // 1. Validate inputs
    const validatedUserId = userIdSchema.parse(userId);
    const validatedPermissionIds = permissionIdsSchema.parse(permissionIds);

    // 2. Call service layer
    return await userService.setDirectPermissions(
      validatedUserId,
      validatedPermissionIds
    );
  } catch (error: any) {
    if (error.name === "ZodError") {
      return {
        success: false,
        message: error.issues[0]?.message || "Invalid input",
      };
    }
    console.error("Error in setUserDirectPermissions:", error);
    return { success: false, message: "Failed to save permissions" };
  }
}

/**
 * Set user role
 */
export async function setUserRole(
  userId: unknown,
  roleId: unknown
): Promise<ActionResult> {
  try {
    // 1. Validate inputs
    const validatedUserId = userIdSchema.parse(userId);
    const validatedRoleId = roleIdSchema.parse(roleId);

    // 2. Call service layer
    return await userService.setRole(validatedUserId, validatedRoleId);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return {
        success: false,
        message: error.issues[0]?.message || "Invalid input",
      };
    }
    console.error("Error in setUserRole:", error);
    return { success: false, message: "Failed to set user role" };
  }
}
