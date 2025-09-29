'use client';

import { deleteRole, roleListWithPagination } from '@/actions/roles';
import { useTable } from '@/hooks/use-table';
import DataTable from '../../../datatable';
import { rolesColumns } from './columns';
import { useCallback, useState } from 'react';
import { useDeleteConfirmation } from '@/hooks/use-delete-confirmation';
import AddEditModal from './addedit';
import ViewModal from './view';
import DeleteConfirmationDialog from '@/components/shared/delete-confirmation-dialog';
import { useAuthStore } from '@/store/authStore';
import { PERMISSIONS } from '@/config/permissions';

export type Role = {
  id: string;
  name: string;
  description: string | null;
  key: string;
  // status: "ACTIVE" | "INACTIVE";
  // createdAt: Date;
  // updatedAt: Date;
};

export default function RolesTable() {
  const [openAddEdit, setOpenAddEdit] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [openView, setOpenView] = useState(false);
  const [viewId, setViewId] = useState<string | null>(null);
  const {
    data,
    pagination,
    isLoading,
    error,
    handleFilterChange,
    handlePageChange,
    handlePageSizeChange,
    refreshData,
  } = useTable({
    tableKey: 'roles',
    dataFetcher: roleListWithPagination,
  });

  const can = useAuthStore((s) => s.can);
  const canChangePermission = can(PERMISSIONS.ROLE_PERMISSION_CHANGE);
  const canChangeDelete = can(PERMISSIONS.DELETE_ROLE);
  const canChangeUpdate = can(PERMISSIONS.UPDATE_ROLE);
  const canChangeCreate = can(PERMISSIONS.CREATE_ROLE);
  const canChangeView = can(PERMISSIONS.VIEW_ROLE);

  const refresh = useCallback(() => {
    void refreshData();
  }, [refreshData]);

  const {
    deleteId,
    isDeleting,
    openDeleteDialog,
    closeDeleteDialog,
    handleDelete,
  } = useDeleteConfirmation({
    onDelete: deleteRole,
    onSuccess: () => {
      // If last item on page got deleted, go back a page; else just refresh
      if (data.length <= 1 && pagination.current_page > 1) {
        handlePageChange(pagination.current_page - 1);
      } else {
        void refreshData();
      }
    },
  });

  const openCreate = () => {
    setEditingId(null);
    setOpenAddEdit(true);
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    setOpenAddEdit(true);
  };

  const handleView = (id: string) => {
    setViewId(id);
    setOpenView(true);
  };

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <DataTable
        columns={rolesColumns}
        data={data}
        title="Roles"
        paginationMeta={pagination}
        isLoading={isLoading}
        tableKey="roles"
        openModal={canChangeCreate ? openCreate : false }
        tableMeta={{
          onView: handleView,
          onEdit: handleEdit,
          onDelete: openDeleteDialog,
          canChangePermission,
          canChangeDelete,
          canChangeUpdate,
          canChangeCreate,
          canChangeView,
        }}
        onFilterChange={handleFilterChange}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
      <AddEditModal
        open={openAddEdit}
        onOpenChange={setOpenAddEdit}
        id={editingId}
        onSuccess={refresh}
      />
      <ViewModal open={openView} onOpenChange={setOpenView} id={viewId} />
      <DeleteConfirmationDialog
        open={!!deleteId}
        onOpenChange={closeDeleteDialog}
        onConfirm={handleDelete}
        title="Delete role?"
        description="This action cannot be undone. This will permanently delete the role."
        isLoading={isDeleting}
      />
    </div>
  );
}
