import { db } from "@/lib/prisma";
import type {
  CreateUserInput,
  UpdateUserInput,
  ListUsersOptions,
} from "@/types/user.types";
import {
  buildOrderBy,
  buildWhereFromFilters,
  paginatePrisma,
} from "@/lib/datatable";

/**
 * User Repository - Data Access Layer
 * Handles all database queries for User entity
 */
export class UserRepository {
  /**
   * Find user by ID with all related profiles
   */
  async findByIdWithProfiles(userId: string) {
    return await db.user.findUnique({
      where: { id: userId },
      include: {
        user_roles: true,
        customer_profile: true,
        rider_profile: true,
        partner_profile: true,
        admin_profile: true,
      },
    });
  }

  /**
   * Find user by ID
   */
  async findById(userId: string) {
    return await db.user.findUnique({
      where: { id: userId },
    });
  }

  /**
   * Find user with permissions
   */
  async findByIdWithPermissions(userId: string) {
    return (await db.user.findUnique({
      where: { id: userId },
      include: { user_permissions: { select: { id: true } } },
    } as any)) as any;
  }

  /**
   * List users with pagination and filtering
   */
  async listWithPagination(options: ListUsersOptions) {
    const { page, page_size, sort, order, filters } = options;
    const where = buildWhereFromFilters(filters);
    const orderBy = buildOrderBy(sort, order);

    return await paginatePrisma(
      db.user,
      { where, orderBy },
      { page, page_size, sort, order, filters }
    );
  }

  /**
   * Create new user
   */
  async create(data: CreateUserInput) {
    return await db.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone ?? null,
        status: data.status,
      },
    });
  }

  /**
   * Update user
   */
  async update(userId: string, data: UpdateUserInput) {
    return await db.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        phone: data.phone ?? null,
        status: data.status,
      },
    });
  }

  /**
   * Delete user
   */
  async delete(userId: string) {
    return await db.user.delete({
      where: { id: userId },
    });
  }

  /**
   * Set user direct permissions (replace strategy)
   */
  async setDirectPermissions(userId: string, permissionIds: string[]) {
    // Reset permissions
    await db.user.update({
      where: { id: userId },
      data: { user_permissions: { set: [] } },
    } as any);

    // Connect new permissions if any
    if (permissionIds?.length) {
      await db.user.update({
        where: { id: userId },
        data: {
          user_permissions: {
            connect: permissionIds.map((id) => ({ id })),
          },
        },
      } as any);
    }
  }

  /**
   * Set user role (replace strategy)
   */
  async setRole(userId: string, roleId: string) {
    // Reset roles
    await db.user.update({
      where: { id: userId },
      data: { user_roles: { set: [] } },
    } as any);

    // Connect new role
    await db.user.update({
      where: { id: userId },
      data: {
        user_roles: {
          connect: [{ id: roleId }],
        },
      },
    } as any);
  }

  /**
   * Check if email exists
   */
  async emailExists(email: string, excludeUserId?: string) {
    const user = await db.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!user) return false;
    if (excludeUserId && user.id === excludeUserId) return false;
    return true;
  }

  /**
   * Check if phone exists
   */
  async phoneExists(phone: string, excludeUserId?: string) {
    if (!phone) return false;

    const user = await db.user.findUnique({
      where: { phone },
      select: { id: true },
    });

    if (!user) return false;
    if (excludeUserId && user.id === excludeUserId) return false;
    return true;
  }
}

export const userRepository = new UserRepository();
