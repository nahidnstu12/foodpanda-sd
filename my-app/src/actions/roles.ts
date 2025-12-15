'use server';

import {
  buildOrderBy,
  buildWhereFromFilters,
  paginatePrisma,
} from '@/lib/datatable';
import { db } from '@/lib/prisma';
import { CommonStatus } from '../../generated/prisma';
import { invalidateRolePermissions } from '@/actions/permissions';

export async function roleListWithPagination(params: any) {
  const { page, page_size, sort, order, filters } = params ?? {};

  const where = buildWhereFromFilters(filters);
  const orderBy = buildOrderBy(sort, order);

  const { items, pagination } = await paginatePrisma(
    db.role,
    { where, orderBy },
    { page, page_size, sort, order, filters }
  );

  return { items, pagination };
}

export async function listActiveRoles() {
  try {
    const roles = await db.role.findMany({
      where: { status: 'ACTIVE' as any },
      select: { id: true, name: true, key: true },
      orderBy: { name: 'asc' },
    });
    return { success: true, data: roles };
  } catch (error) {
    console.error('listActiveRoles error:', error);
    return { success: false, message: 'Failed to fetch roles' };
  }
}

export async function getRoleById(id: string) {
  if (!id) return { success: false, message: 'Missing id' };
  try {
    const role = await db.role.findUnique({ where: { id } });
    if (!role) return { success: false, message: 'Role not found' };
    return { success: true, data: role };
  } catch (error) {
    console.error('getRoleById error:', error);
    return { success: false, message: 'Failed to fetch role' };
  }
}

export async function createRole(input: {
  name: string;
  key: string;
  description?: string | null;
  status: CommonStatus;
}) {
  try {
    const created = await db.role.create({
      data: {
        name: input.name,
        key: input.key,
        description: input.description ?? null,
        status: input.status,
      },
    });
    return { success: true, data: created };
  } catch (error: any) {
    console.error('createRole error:', error);
    const message =
      error?.code === 'P2002' ? 'Key must be unique' : 'Failed to create Role';
    return { success: false, message };
  }
}

export async function updateRole(
  id: string,
  input: {
    name: string;
    key: string;
    status: CommonStatus;
    description?: string | null;
  }
) {
  if (!id) return { success: false, message: 'Missing id' };
  try {
    const updated = await db.role.update({
      where: { id },
      data: {
        name: input.name,
        key: input.key,
        status: input.status,
        description: input.description ?? null,
      },
    });
    return { success: true, data: updated };
  } catch (error: any) {
    console.error('updateRole error:', error);
    const message =
      error?.code === 'P2002' ? 'Key must be unique' : 'Failed to update role';
    return { success: false, message };
  }
}

export async function deleteRole(id: string) {
  if (!id) return { success: false, message: 'Missing id' };
  try {
    await db.role.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    console.error('deleteRole error:', error);
    return { success: false, message: 'Failed to delete role' };
  }
}

export async function getRolePermissions(roleId: string) {
  if (!roleId) return { success: false, message: 'Missing roleId' };
  try {
    const role = await db.role.findUnique({
      where: { id: roleId },
      select: {
        id: true,
        role_permissions: {
          select: { id: true, key: true, name: true, group: true },
        },
      },
    });
    if (!role) return { success: false, message: 'Role not found' };
    return { success: true, data: role.role_permissions };
  } catch (error) {
    console.error('getRolePermissions error:', error);
    return { success: false, message: 'Failed to fetch role permissions' };
  }
}

export async function assignRolePermissions(
  roleId: string,
  permissionIds: string[]
) {
  if (!roleId) return { success: false, message: 'Missing roleId' };
  try {
    await db.role.update({
      where: { id: roleId },
      data: {
        role_permissions: {
          set: [],
        },
      },
    });

    if (permissionIds?.length) {
      await db.role.update({
        where: { id: roleId },
        data: {
          role_permissions: {
            connect: permissionIds.map((id) => ({ id })),
          },
        },
      });
    }

    await invalidateRolePermissions(roleId);
    return { success: true };
  } catch (error) {
    console.error('assignRolePermissions error:', error);
    return { success: false, message: 'Failed to assign role permissions' };
  }
}
