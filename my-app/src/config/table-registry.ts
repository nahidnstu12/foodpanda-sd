import { usersColumns } from "@/components/pages/admin/users/columns";
import { permissionsColumns } from "@/components/pages/admin/permissions/columns";
import { generateTableConfig } from "@/helpers/filterUtils";
import { rolesColumns } from "@/components/pages/admin/roles/columns";

export const TABLE_REGISTRY = {
  users: generateTableConfig("users", usersColumns, 10),
  permissions: generateTableConfig("permissions", permissionsColumns, 10),
  roles: generateTableConfig("roles", rolesColumns, 10),
} as const;

export type TableKey = keyof typeof TABLE_REGISTRY;
