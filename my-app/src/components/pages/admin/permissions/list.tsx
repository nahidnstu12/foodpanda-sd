"use client";

import { permissionListWithPagination } from "@/actions/permissions";
import { useTable } from "@/hooks/use-table";
import DataTable from "../../../datatable";
import { permissionsColumns } from "./columns";
import AddEditPermissionModal from "./addedit";
import ViewPermissionModal from "./view";
import { deletePermission } from "@/actions/permissions";
import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { PermissionRowActionHandlers } from "./columns";

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
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
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

  const refresh = useCallback(() => {
    void refreshData();
  }, [refreshData]);

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

  const handleDelete = async () => {
    if (!confirmDeleteId) return;
    const res = await deletePermission(confirmDeleteId);
    setConfirmDeleteId(null);
    if (res?.success) {
      // If last item on page got deleted, go back a page; else just refresh
      if (data.length <= 1 && pagination.current_page > 1) {
        handlePageChange(pagination.current_page - 1);
      } else {
        // explicit refresh avoids URL/filters mutation loops
        void refreshData();
      }
    }
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
        openModal={openCreate}
        tableMeta={
          {
            onView: handleView,
            onEdit: handleEdit,
            onDelete: (id: string) => setConfirmDeleteId(id),
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
      <Dialog
        open={!!confirmDeleteId}
        onOpenChange={(o: boolean) => !o && setConfirmDeleteId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete permission?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              permission.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirmDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
