"use client";

import { roleListWithPagination } from "@/actions/roles";
import { useTable } from "@/hooks/use-table";
import DataTable from "../../../datatable";
import { rolesColumns } from "./columns";

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
  const {
    data,
    pagination,
    isLoading,
    error,
    handleFilterChange,
    handlePageChange,
    handlePageSizeChange,
  } = useTable({
    tableKey: "roles",
    dataFetcher: roleListWithPagination,
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
        columns={rolesColumns}
        data={data}
        title="Roles"
        paginationMeta={pagination}
        isLoading={isLoading}
        tableKey="roles"
        openModal={() => console.log("Open modal")}
        onFilterChange={handleFilterChange}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}
