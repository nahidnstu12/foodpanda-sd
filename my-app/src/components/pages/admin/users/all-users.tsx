"use client";

import { userListWithPagination } from "@/actions/user";
import {
  modalFormatToFilters,
  parseBrowserUrlToFilters,
  USERS_FIELD_TYPE_MAP,
} from "@/helpers/filterUtils";
import { selectTableState, useDatatableStore } from "@/store/datatableStore";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import DataTable from "../../../datatable";
import { columns } from "./columns";

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  emailVerified: boolean;
  is_phone_verified: boolean;
  createdAt: string;
  updatedAt: string;
};

// sort=-name&page[offset]=0&page[limit]=10&filter[status]=ACTIVE&filter[name]=*john*

export default function UsersTable() {
  const [data, setData] = useState<User[]>([]);
  const [pagination, setPagination] = useState({
    total_records: 0,
    page_size: 10,
    current_page: 1,
    total_pages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const { initTable, setTableParams } = useDatatableStore();
  const tableState = useDatatableStore((s) => selectTableState(s, "users"));

  // Initialize table state from URL params
  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    // Parse URL params
    const page =
      parseInt(params.get("page[offset]") || "0") /
        parseInt(params.get("page[limit]") || "10") +
      1;
    const pageSize = parseInt(params.get("page[limit]") || "10");
    const sort = params.get("sort")?.replace("-", "");
    const order = params.get("sort")?.startsWith("-") ? "desc" : "asc";

    // Parse filters from URL
    const filters = parseBrowserUrlToFilters(params, USERS_FIELD_TYPE_MAP);

    // Initialize table state
    initTable({
      key: "users",
      initial: {
        page: Math.max(1, page),
        page_size: pageSize,
        sort: sort || undefined,
        order: order as "asc" | "desc" | undefined,
        filters: Object.keys(filters).length > 0 ? filters : undefined,
      },
    });
  }, [searchParams, initTable]);

  // Fetch data when table state changes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { items, pagination: paginationData } =
          await userListWithPagination({
            page: tableState.page,
            page_size: tableState.page_size,
            sort: tableState.sort,
            order: tableState.order,
            filters: tableState.filters,
          });
        setData(items as unknown as User[]);
        setPagination(paginationData);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [
    tableState.page,
    tableState.page_size,
    tableState.sort,
    tableState.order,
    tableState.filters,
  ]);

  const handleFilterChange = (newFilters: Record<string, any>) => {
    const filters = modalFormatToFilters(newFilters, USERS_FIELD_TYPE_MAP);
    setTableParams({
      key: "users",
      params: { page: 1, filters },
    });
  };

  const handlePageChange = (page: number) => {
    setTableParams({
      key: "users",
      params: { page },
    });
  };

  const handlePageSizeChange = (pageSize: number) => {
    setTableParams({
      key: "users",
      params: { page_size: pageSize, page: 1 },
    });
  };

  return (
    <div className="container mx-auto py-6">
      <DataTable
        columns={columns}
        data={data}
        title="Users"
        paginationMeta={pagination}
        isLoading={isLoading}
        tableKey="users"
        openModal={() => console.log("Open modal")}
        onFilterChange={handleFilterChange}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}
