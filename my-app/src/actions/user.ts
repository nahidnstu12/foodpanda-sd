"use server";

import db from "@/lib/prisma";
import {
  buildOrderBy,
  buildWhereFromFilters,
  paginatePrisma,
} from "@/lib/datatable";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { UserRole } from "@/helpers/user.enum";
import { UserStatus } from "../../generated/prisma";
import { apiLogger } from "@/lib/logger";
import { withActionGuard } from "@/lib/withActionGuard";
import { PERMISSIONS } from "@/config/permissions";

export async function findUserRoles(userId: string) {
  if (!userId) return { success: false, message: "User not found" };
  try {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        user_roles: true,
        customer_profile: true,
        rider_profile: true,
        partner_profile: true,
        admin_profile: true,
      },
    });
    const userData = {
      ...user,
      // store a primitive to avoid circular JSON/complex objects from Prisma
      selected_role: user?.user_roles?.[0]?.key ?? null,
      roles: user?.user_roles?.map((role) => role.key) ?? [],
      role_id: user?.user_roles?.[0]?.id ?? null,
    };
    return { success: true, data: userData };
  } catch (error) {
    console.error("Error finding user roles:", error);
    return { success: false, message: "Error finding user roles" };
  }
}

export async function userListWithPagination(params: any) {
  const { page, page_size, sort, order, filters } = params ?? {};
  const result = await withActionGuard(
    "user.list",
    { anyOf: [PERMISSIONS.LIST_USERS, PERMISSIONS.VIEW_USER], audit: true },
    async ({ userId }) => {
      const where = buildWhereFromFilters(filters);
      const orderBy = buildOrderBy(sort, order);

      // scope: non-admins can only see users sharing their roles
      const session = await auth.api.getSession({ headers: await headers() });
      const roles: string[] = (session?.user as any)?.roles ?? [];
      const isAdmin =
        roles?.includes(UserRole.ADMIN) ||
        roles?.includes(UserRole.SUPER_ADMIN);

      let effectiveWhere: any = where ?? {};
      if (!isAdmin && roles?.length) {
        const roleScopeFilter = {
          user_roles: { some: { key: { in: roles } } },
        } as const;
        const hasBaseFilters =
          effectiveWhere && Object.keys(effectiveWhere).length > 0;
        effectiveWhere = hasBaseFilters
          ? { AND: [effectiveWhere, roleScopeFilter] }
          : roleScopeFilter;
      }

      const { items, pagination } = await paginatePrisma(
        db.user,
        { where: effectiveWhere, orderBy },
        { page, page_size, sort, order, filters }
      );
      return { items, pagination };
    }
  );
  if (!result.success) {
    throw new Error(result.message || "Unauthorized");
  }
  return result.data;
}

export async function getUserById(id: string) {
  if (!id) return { success: false, message: "Missing id" };
  const result = await withActionGuard(
    "user.get",
    { required: PERMISSIONS.VIEW_USER, audit: true },
    async () => {
      const user = await db.user.findUnique({ where: { id } });
      if (!user) throw new Error("NOT_FOUND");
      return user;
    }
  );
  if (!result.success) return result;
  return { success: true, data: result.data };
}

export async function createUser(input: {
  name: string;
  email: string;
  phone?: string | null;
  status: UserStatus;
}) {
  const result = await withActionGuard(
    "user.create",
    { required: PERMISSIONS.CREATE_USER, audit: true },
    async () => {
      const created = await db.user.create({
        data: {
          name: input.name,
          email: input.email,
          phone: input.phone ?? null,
          status: input.status,
        },
      });
      return created;
    }
  );
  if (!result.success)
    return {
      success: false,
      message: result.message,
    } as any;
  return { success: true, data: result.data };
}

export async function updateUser(
  id: string,
  input: { name: string; phone?: string | null; status: UserStatus }
) {
  if (!id) return { success: false, message: "Missing id" };
  const result = await withActionGuard(
    "user.update",
    { required: PERMISSIONS.UPDATE_USER, audit: true },
    async () => {
      const updated = await db.user.update({
        where: { id },
        data: {
          name: input.name,
          phone: input.phone ?? null,
          status: input.status,
        },
      });
      return updated;
    }
  );
  if (!result.success) return result as any;
  return { success: true, data: result.data };
}

export async function deleteUser(id: string) {
  if (!id) return { success: false, message: "Missing id" };
  const result = await withActionGuard(
    "user.delete",
    { required: PERMISSIONS.DELETE_USER, audit: true },
    async () => {
      await db.user.delete({ where: { id } });
      return true;
    }
  );
  if (!result.success) return result as any;
  return { success: true };
}

export async function getUserDirectPermissions(userId: string) {
  if (!userId) return { success: false, message: "Missing userId" };
  try {
    const user = (await db.user.findUnique({
      where: { id: userId },
      include: { user_permissions: { select: { id: true } } },
    } as any)) as any;
    return {
      success: true,
      data: (user?.user_permissions ?? []).map((p: any) => p.id),
    };
  } catch (e) {
    console.error("getUserDirectPermissions error:", e);
    return { success: false, message: "Failed to fetch permissions" };
  }
}

export async function setUserDirectPermissions(
  userId: string,
  permissionIds: string[]
) {
  if (!userId) return { success: false, message: "Missing userId" };
  try {
    // Reset then connect (replace strategy)
    await db.user.update({
      where: { id: userId },
      data: { user_permissions: { set: [] } },
    } as any);
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
    return { success: true };
  } catch (e) {
    console.error("setUserDirectPermissions error:", e);
    return { success: false, message: "Failed to save permissions" };
  }
}

export async function setUserRole(userId: string, roleId: string) {
  if (!userId || !roleId)
    return { success: false, message: "Missing userId or roleId" };
  try {
    // replace existing roles with the selected one
    await db.user.update({
      where: { id: userId },
      data: {
        user_roles: {
          set: [],
        },
      },
    } as any);

    await db.user.update({
      where: { id: userId },
      data: {
        user_roles: {
          connect: [{ id: roleId }],
        },
      },
    } as any);

    return { success: true };
  } catch (e) {
    console.error("setUserRole error:", e);
    return { success: false, message: "Failed to set user role" };
  }
}
