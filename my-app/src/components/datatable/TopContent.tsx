import type { Table } from "@tanstack/react-table";
import FilterModal from "./FilterModal";
import { Button } from "../ui/button";

interface TopContentProps<T> {
  table: Table<T>;
  title: string;
  onFilterChange: (filters: Record<string, any>) => void;
  filters?: Record<string, any>;
  meta: {
    total: number;
    page: number;
    page_size: number;
  };
  openModal?: (() => void) | false;
  tableKey: string;
}

export default function TopContent<T>({
  table,
  title,
  onFilterChange,
  filters = {},
  meta,
  openModal,
  tableKey,
}: TopContentProps<T>) {
  return (
    <div className="flex items-center justify-between py-4">
      <h2 className="text-lg font-semibold">
        {title}{" "}
        <span className="text-sm text-gray-500">
          (Showing {meta.page * meta.page_size - meta.page_size + 1} to{" "}
          {meta.page * meta.page_size} of {meta.total} entries)
        </span>
      </h2>
      <div className="flex items-center space-x-2">
        <FilterModal
          table={table}
          onFilterChange={onFilterChange}
          filters={filters}
          tableKey={tableKey}
        />
        {typeof openModal === "function" && (
          <Button onClick={openModal}>Add New</Button>
        )}
      </div>
    </div>
  );
}
