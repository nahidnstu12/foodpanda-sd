"use client";

import { userListWithPagination } from "@/actions/user";
import { useTable } from "@/hooks/use-table";
import DataTable from "../../../datatable";
import { usersColumns } from "./columns";

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  emailVerified: boolean;
  is_phone_verified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export default function UsersTable() {
  const {
    data,
    pagination,
    isLoading,
    error,
    handleFilterChange,
    handlePageChange,
    handlePageSizeChange,
  } = useTable({
    tableKey: "users",
    dataFetcher: userListWithPagination,
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
        columns={usersColumns}
        data={data}
        title="Users"
        paginationMeta={pagination}
        isLoading={isLoading}
        tableKey="users"
        openModal={() => console.log("Open modal")}
        onFilterChange={handleFilterChange}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        syncUrl={false} // disable sync url, need to check 
      />
    </div>
  );
}
