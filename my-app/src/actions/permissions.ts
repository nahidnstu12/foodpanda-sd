"use server";

import { UserPermissions } from "@/lib/permissionCache";
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
