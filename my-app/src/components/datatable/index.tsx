import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import { initTable, setTableParams } from "@/store/features/datatableSlice";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useEffect } from "react";
import {
  useDatatableStore,
  DEFAULT_TABLE_STATE,
  selectTableState,
} from "@/store/datatableStore";
import { useShallow } from "zustand/react/shallow";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import BottomContent from "./BottomContent";
import TopContent from "./TopContent";
import type { CustomColumnDef } from "./type";
import {
  generateApiUrlParams,
  modalFormatToFilters,
  NOTICES_FIELD_TYPE_MAP,
} from "@/helpers/filterUtils";
import Loader from "../shared/loader";

export interface PaginationMeta {
  total_records: number;
  page_size: number;
  current_page: number;
  total_pages: number;
}

interface DataTableProps<TData> {
  columns: CustomColumnDef<TData>[];
  data: TData[];
  title: string;
  paginationMeta?: PaginationMeta;
  isLoading?: boolean;
  tableKey: string;
  openModal: () => void;
  onFilterChange?: (filters: Record<string, any>) => void;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

const DEFAULT_STATE = {
  page: 1,
  page_size: 10,
  sort: undefined,
  order: undefined,
  search: undefined,
  status: undefined,
  filters: undefined,
};

export default function DataTable<TData>({
  columns,
  data,
  title,
  paginationMeta,
  isLoading = false,
  tableKey,
  openModal,
  onFilterChange,
  onPageChange,
  onPageSizeChange,
}: DataTableProps<TData>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { initTable, setTableParams } = useDatatableStore(
    useShallow((s) => ({
      initTable: s.initTable,
      setTableParams: s.setTableParams,
    }))
  );
  const tableState = useDatatableStore((s) => selectTableState(s, tableKey));

  // Initialize table state in store
  useEffect(() => {
    initTable({ key: tableKey, initial: DEFAULT_TABLE_STATE });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableKey]);

  // Sync Redux state to URL
  useEffect(() => {
    const params = new URLSearchParams();

    // sort & order
    if (tableState.sort) {
      params.set(
        "sort",
        tableState.order === "desc" ? `-${tableState.sort}` : tableState.sort
      );
    }
    // pagination -> page[offset], page[limit]
    const pageSize = tableState.page_size ?? 10;
    const page = tableState.page ?? 1;
    params.set("page[limit]", String(pageSize));
    params.set("page[offset]", String(Math.max(0, (page - 1) * pageSize)));

    // filters (with operators in values)
    if (tableState.filters) {
      const filterParams = generateApiUrlParams(tableState.filters);
      for (const [k, v] of filterParams.entries()) params.append(k, v);
    }

    const next = params.toString();
    if (next !== searchParams.toString()) {
      router.replace(`${pathname}${next ? `?${next}` : ""}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pathname,
    tableState.page,
    tableState.page_size,
    tableState.sort,
    tableState.order,
    tableState.filters,
  ]);

  // Table instance
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    state: {
      sorting: tableState.sort
        ? [{ id: tableState.sort, desc: tableState.order === "desc" }]
        : [],
    },
  });

  // Sorting handler
  const handleSorting = (header: any) => {
    if (!header.column.getCanSort()) return;
    const currentField = tableState.sort;
    const currentDirection = tableState.order;
    let newDirection: "asc" | "desc" = "asc";
    if (currentField === header.column.id && currentDirection === "asc") {
      newDirection = "desc";
    }
    setTableParams({
      key: tableKey,
      params: { sort: header.column.id, order: newDirection, page: 1 },
    });
  };

  // Filter handler (for TopContent, if you want to support it)
  const handleFilterChange = (newFilters: Record<string, any>) => {
    if (onFilterChange) {
      onFilterChange(newFilters);
    } else {
      // Convert modal format to filter state using utility function
      const filters = modalFormatToFilters(newFilters, NOTICES_FIELD_TYPE_MAP);
      const updatedParams: Record<string, any> = { ...tableState, page: 1 };
      if (Object.keys(filters).length > 0) {
        updatedParams.filters = filters;
      } else {
        delete (updatedParams as any).filters;
      }
      setTableParams({ key: tableKey, params: updatedParams });
    }
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    } else {
      setTableParams({ key: tableKey, params: { page } });
    }
  };
  const handlePageSizeChange = (page_size: number) => {
    if (onPageSizeChange) {
      onPageSizeChange(page_size);
    } else {
      setTableParams({ key: tableKey, params: { page_size, page: 1 } });
    }
  };

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-100px)] max-h-[calc(100vh-100px)] overflow-hidden py-2 px-4">
      <div className="sticky top-0 bg-background">
        <TopContent
          table={table}
          title={title}
          onFilterChange={handleFilterChange}
          filters={tableState}
          meta={
            paginationMeta
              ? {
                  total: paginationMeta.total_records,
                  page: paginationMeta.current_page,
                  page_size: paginationMeta.page_size,
                }
              : { total: 0, page: 1, page_size: 10 }
          }
          openModal={openModal}
          tableKey={tableKey}
        />
      </div>
      <div className="overflow-y-auto">
        <div className="rounded-md border min-w-full">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const isSorted =
                      tableState.sort === header.column.id
                        ? tableState.order
                        : undefined;
                    return (
                      <TableHead
                        key={header.id}
                        onClick={() => handleSorting(header)}
                        className={
                          header.column.getCanSort()
                            ? "cursor-pointer select-none"
                            : ""
                        }
                      >
                        <div className="flex items-center justify-start gap-2">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                          {isSorted === "asc" && (
                            <ArrowUp className="h-4 w-4" />
                          )}
                          {isSorted === "desc" && (
                            <ArrowDown className="h-4 w-4" />
                          )}
                        </div>
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    <Loader />
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      {paginationMeta && (
        <div className="sticky bottom-0 bg-background max-w-[78vw]">
          <BottomContent
            paginationMeta={paginationMeta}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      )}
    </div>
  );
}
