"use server";

import {
  buildOrderBy,
  buildWhereFromFilters,
  paginatePrisma,
} from "@/lib/datatable";
import { UserPermissions } from "@/lib/permissionCache";
import db from "@/lib/prisma";
import PermissionService from "@/services/permissionService";

const permissionService = new PermissionService();

export async function getUserPermissions(
  userId: string
): Promise<UserPermissions> {
  return permissionService.getUserPermissions(userId);
}

export async function invalidateUserPermissions(userId: string): Promise<void> {
  await permissionService.invalidateUserPermissions(userId);
}

export async function invalidateRolePermissions(roleId: string): Promise<void> {
  await permissionService.invalidateRolePermissions(roleId);
}

export async function clearAllPermissionCaches(): Promise<void> {
  await permissionService.clearAllCaches();
}

export async function permissionListWithPagination(params: any) {
  const { page, page_size, sort, order, filters } = params ?? {};

  const where = buildWhereFromFilters(filters);
  const orderBy = buildOrderBy(sort, order);

  const { items, pagination } = await paginatePrisma(
    db.permission,
    { where, orderBy },
    { page, page_size, sort, order, filters }
  );

  return { items, pagination };
}

export async function getPermissionById(id: string) {
  if (!id) return { success: false, message: "Missing id" };
  try {
    const permission = await db.permission.findUnique({ where: { id } });
    if (!permission) return { success: false, message: "Permission not found" };
    return { success: true, data: permission };
  } catch (error) {
    console.error("getPermissionById error:", error);
    return { success: false, message: "Failed to fetch permission" };
  }
}

export async function createPermission(input: {
  name: string;
  key: string;
  group?: string | null;
  description?: string | null;
}) {
  try {
    const created = await db.permission.create({
      data: {
        name: input.name,
        key: input.key,
        group: input.group ?? null,
        description: input.description ?? null,
      },
    });
    return { success: true, data: created };
  } catch (error: any) {
    console.error("createPermission error:", error);
    const message =
      error?.code === "P2002"
        ? "Key must be unique"
        : "Failed to create permission";
    return { success: false, message };
  }
}

export async function updatePermission(
  id: string,
  input: {
    name: string;
    key: string;
    group?: string | null;
    description?: string | null;
  }
) {
  if (!id) return { success: false, message: "Missing id" };
  try {
    const updated = await db.permission.update({
      where: { id },
      data: {
        name: input.name,
        key: input.key,
        group: input.group ?? null,
        description: input.description ?? null,
      },
    });
    return { success: true, data: updated };
  } catch (error: any) {
    console.error("updatePermission error:", error);
    const message =
      error?.code === "P2002"
        ? "Key must be unique"
        : "Failed to update permission";
    return { success: false, message };
  }
}

export async function deletePermission(id: string) {
  if (!id) return { success: false, message: "Missing id" };
  try {
    await db.permission.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    console.error("deletePermission error:", error);
    return { success: false, message: "Failed to delete permission" };
  }
}
