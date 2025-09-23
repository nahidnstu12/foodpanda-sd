'use client';

import { deleteUser, userListWithPagination } from '@/actions/user';
import { useTable } from '@/hooks/use-table';
import DataTable from '../../../datatable';
import { usersColumns } from './columns';
import { useCallback, useState } from 'react';
import { useDeleteConfirmation } from '@/hooks/use-delete-confirmation';
import AddEditModal from './addedit';
import ViewModal from './view';
import DeleteConfirmationDialog from '@/components/shared/delete-confirmation-dialog';

export type AppUser = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
};

export default function UsersTable() {
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
    tableKey: 'users',
    dataFetcher: userListWithPagination,
  });

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
    onDelete: deleteUser,
    onSuccess: () => {
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
        columns={usersColumns}
        data={data}
        title="Users"
        paginationMeta={pagination}
        isLoading={isLoading}
        tableKey="users"
        openModal={openCreate}
        tableMeta={{
          onView: handleView,
          onEdit: handleEdit,
          onDelete: openDeleteDialog,
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
        title="Delete user?"
        description="This action cannot be undone. This will permanently delete the user."
        isLoading={isDeleting}
      />
    </div>
  );
}
