"use client";

import { permissionListWithPagination } from "@/actions/permissions";
import { useTable } from "@/hooks/use-table";
import DataTable from "../../../datatable";
import { permissionsColumns } from "./columns";

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
  const {
    data,
    pagination,
    isLoading,
    error,
    handleFilterChange,
    handlePageChange,
    handlePageSizeChange,
  } = useTable({
    tableKey: "permissions",
    dataFetcher: permissionListWithPagination,
  });

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
        openModal={() => console.log("Open modal")}
        onFilterChange={handleFilterChange}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}
