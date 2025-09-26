"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import PermissionService from "@/services/permissionService";
import { apiLogger } from "@/lib/logger";

type GuardOptions = {
  required?: string | string[];
  anyOf?: string[]; // pass if has any of these
  allOf?: string[]; // pass if has all of these (alias of required)
  allowRoles?: string[]; // optional fast-path allow by role key
  denyRoles?: string[]; // optional deny list by role key
  audit?: boolean; // log success/failure
};

type GuardResult<T> =
  | { success: true; data: T }
  | { success: false; message: string; code?: string; status?: number };

const permissionService = new PermissionService();

export async function withActionGuard<T>(
  actionName: string,
  options: GuardOptions,
  action: (ctx: {
    userId: string;
    roleKey?: string;
    has: (perm: string) => boolean;
  }) => Promise<T>
): Promise<GuardResult<T>> {
  const start = Date.now();
  try {
    const h = await headers();
    const session = await auth.api.getSession({ headers: h });
    const userId = session?.user?.id as string | undefined;

    if (!userId) {
      return {
        success: false,
        message: "Unauthenticated",
        code: "UNAUTH",
        status: 401,
      };
    }

    const perms = await permissionService.getUserPermissions(userId);
    apiLogger.debug("User permissions:", {
      userId: perms.userId,
      role: perms.roleName,
      permissions: Array.from(perms.permissions),
      allRolePermissions: Array.from(perms.allRolePermissions.entries()).map(
        ([role, set]) => ({ role, permissions: Array.from(set) })
      ),
    });
    const roleKey = perms.roleName; // matches PermissionService construction
    const has = (perm: string) => perms.permissions.has(perm);

    if (
      options?.denyRoles?.length &&
      roleKey &&
      options.denyRoles.includes(roleKey)
    ) {
      return {
        success: false,
        message: "Forbidden",
        code: "FORBIDDEN",
        status: 403,
      };
    }
    if (
      options?.allowRoles?.length &&
      roleKey &&
      options.allowRoles.includes(roleKey)
    ) {
      // allowed by role fast-path
      console.log("allowed by role fast-path");
    } else {
      const allRequired = (
        Array.isArray(options?.required)
          ? options?.required
          : options?.required
          ? [options.required]
          : []
      ).concat(options?.allOf ?? []);
      if (allRequired.length && !allRequired.every((p) => has(p))) {
        return {
          success: false,
          message: "Missing required permission",
          code: "NO_PERMISSION",
          status: 403,
        };
      }
      if (options?.anyOf?.length && !options.anyOf.some((p) => has(p))) {
        return {
          success: false,
          message: "Missing required permission (anyOf)",
          code: "NO_PERMISSION",
          status: 403,
        };
      }
    }

    const data = await action({ userId, roleKey, has });

    if (options?.audit) {
      apiLogger.info(`Action ${actionName} OK`, {
        durationMs: Date.now() - start,
        userId,
      });
    }

    return { success: true, data };
  } catch (e: any) {
    console.log("error>>", e);
    if (options?.audit) {
      apiLogger.error(`Action ${actionName} FAIL`, {
        durationMs: Date.now() - start,
        error: e?.message || String(e),
      });
    }
    return {
      success: false,
      message: "Internal error",
      code: "ERR",
      status: 500,
    };
  }
}
