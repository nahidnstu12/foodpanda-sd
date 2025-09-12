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
