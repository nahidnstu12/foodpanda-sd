"use client";

import { permissionListWithPagination } from "@/actions/permissions";
import { useTable } from "@/hooks/use-table";
import DataTable from "../../../datatable";
import { permissionsColumns } from "./columns";
import AddEditPermissionModal from "./addedit";
import ViewPermissionModal from "./view";
import { deletePermission } from "@/actions/permissions";
import { useState, useCallback } from "react";
import type { PermissionRowActionHandlers } from "./columns";
import DeleteConfirmationDialog from "@/components/shared/delete-confirmation-dialog";
import { useDeleteConfirmation } from "@/hooks/use-delete-confirmation";
import { useAuthStore } from "@/store/authStore";
import { PERMISSIONS } from "@/config/permissions";

export type Permission = {
  id: string;
  name: string;
  description: string | null;
  group: string | null;
  key: string;
  // status: "ACTIVE" | "INACTIVE";
  // createdAt: Date;
  // updatedAt: Date;
};

export default function PermissionsTable() {
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
    tableKey: "permissions",
    dataFetcher: permissionListWithPagination,
  });

  const can = useAuthStore((s) => s.can);
  const canChangeDelete = can(PERMISSIONS.DELETE_PERMISSION);
  const canChangeUpdate = can(PERMISSIONS.UPDATE_PERMISSION);
  const canChangeCreate = can(PERMISSIONS.CREATE_PERMISSION);
  const canChangeView = can(PERMISSIONS.VIEW_PERMISSION);

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
    onDelete: deletePermission,
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
        columns={permissionsColumns}
        data={data}
        title="Permissions"
        paginationMeta={pagination}
        isLoading={isLoading}
        tableKey="permissions"
        {...(canChangeCreate ? { openModal: openCreate } : {})}
        tableMeta={
          {
            onView: handleView,
            onEdit: handleEdit,
            onDelete: openDeleteDialog,
            canChangeDelete,
            canChangeUpdate,
            canChangeCreate,
            canChangeView,
          } as PermissionRowActionHandlers
        }
        onFilterChange={handleFilterChange}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
      {/* set row action handlers via registry meta through store-free prop on table config */}
      <AddEditPermissionModal
        open={openAddEdit}
        onOpenChange={setOpenAddEdit}
        id={editingId}
        onSuccess={refresh}
      />
      <ViewPermissionModal
        open={openView}
        onOpenChange={setOpenView}
        id={viewId}
      />
      <DeleteConfirmationDialog
        open={!!deleteId}
        onOpenChange={closeDeleteDialog}
        onConfirm={handleDelete}
        title="Delete permission?"
        description="This action cannot be undone. This will permanently delete the permission."
        isLoading={isDeleting}
      />
    </div>
  );
}
