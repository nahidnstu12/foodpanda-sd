import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDatatableStore } from "@/store/datatableStore";
import type { Table } from "@tanstack/react-table";
import { Filter } from "lucide-react";
import { useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import DateRangeInput from "./DateRangeInput";
import type { CustomColumnDef } from "./type";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { filtersToModalFormat } from "@/helpers/filterUtils";

interface FilterModalProps<T> {
  table: Table<T>;
  onFilterChange: (filters: Record<string, any>) => void;
  filters?: Record<string, any>;
  tableKey: string;
}
export default function FilterModal<T>({
  table,
  onFilterChange,
  filters = {},
  tableKey,
}: FilterModalProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const { resetTable } = useDatatableStore(
    useShallow((s) => ({ resetTable: s.resetTable }))
  );

  // Track filter values locally
  const filterableColumns = useMemo(
    () =>
      table.getAllColumns().filter((col) => col.columnDef?.enableColumnFilter),
    [table]
  );

  // Initialize filter values from Redux state
  const initialFilterState = useMemo(() => {
    // Use utility function to convert filter state to modal format
    const modalFormat = filters.filters
      ? filtersToModalFormat(filters.filters)
      : {};

    // Ensure all filterable columns have default values
    const state: Record<string, any> = {};
    filterableColumns.forEach((col) => {
      const columnId = col.id;
      const columnDef = col.columnDef as CustomColumnDef<T>;

      if (columnDef.filterField === "daterange") {
        state[columnId] = modalFormat[columnId] || { from: "", to: "" };
      } else {
        state[columnId] = modalFormat[columnId] || "";
      }
    });

    return state;
  }, [filterableColumns, filters]);

  const [filterValues, setFilterValues] = useState(initialFilterState);

  // Update local state when modal opens
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setFilterValues(initialFilterState);
    }
  };

  const handleInputChange = (columnId: string, value: any) => {
    setFilterValues((prev) => ({ ...prev, [columnId]: value }));
  };

  const handleApply = () => {
    // Process filters for server request
    const activeFilters = Object.entries(filterValues).reduce(
      (acc, [key, value]) => {
        if (value) {
          if (
            typeof value === "object" &&
            value !== null &&
            typeof (value as any).from !== "undefined"
          ) {
            // Handle date range
            const from = (value as any).from;
            const to = (value as any).to;
            if (from) {
              acc[`${key}_from`] = from;
            }
            if (to) {
              acc[`${key}_to`] = to;
            }
          } else if (value !== "all") {
            // Handle other filters
            acc[key] = value;
          }
        }
        return acc;
      },
      {} as Record<string, any>
    );

    onFilterChange(activeFilters);
    setIsOpen(false);
  };

  const handleReset = () => {
    // Reset table state to default (page: 1, page_size: 10)
    resetTable(tableKey);
    // Clear local filter values
    setFilterValues(
      Object.keys(filterValues).reduce((acc, key) => {
        const columnDef = filterableColumns.find(
          (col) => col.id === key
        ) as CustomColumnDef<T>;
        if (columnDef?.filterField === "daterange") {
          acc[key] = { from: undefined, to: undefined };
        } else {
          acc[key] = "";
        }
        return acc;
      }, {} as Record<string, any>)
    );
    // Modal stays open
  };

  const getColumnLabel = (header: any) => {
    const columnDef = header.column.columnDef as CustomColumnDef<T>;
    if (typeof columnDef.header === "function") {
      const context = header.getContext();
      const headerContent = columnDef.header(context);
      if (headerContent && typeof headerContent === "object") {
        return headerContent.props?.children || header.column.id;
      }
      return headerContent;
    }
    return columnDef.header || header.column.id;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="ml-2">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Filter Table</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {table.getHeaderGroups().map((headerGroup) =>
            headerGroup.headers
              .filter((header) => {
                const columnDef = header.column.columnDef as CustomColumnDef<T>;
                return columnDef.enableColumnFilter;
              })
              .map((header) => {
                const columnDef = header.column.columnDef as CustomColumnDef<T>;
                const filterField = columnDef.filterField;
                const label = getColumnLabel(header);
                const filteredItems = columnDef.filteredItems || [];
                const column = header.column;
                const columnId = column.id;

                if (filterField === "daterange") {
                  return (
                    <DateRangeInput
                      label={label}
                      value={
                        typeof filterValues[columnId] === "object" &&
                        filterValues[columnId] !== null
                          ? filterValues[columnId]
                          : { from: undefined, to: undefined }
                      }
                      onChange={(val) => handleInputChange(columnId, val)}
                      name={columnId}
                      key={columnId}
                    />
                  );
                }

                if (filterField === "date") {
                  const dateValue = filterValues[columnId]
                    ? new Date(filterValues[columnId])
                    : null;
                  return (
                    <div
                      key={columnId}
                      className="grid grid-cols-4 items-center gap-4"
                    >
                      <label htmlFor={columnId} className="text-right">
                        {label}
                      </label>
                      <div className="w-full col-span-3">
                        <style>
                          {`
                                    .react-datepicker-wrapper {
                                        width: 100%;
                                    }
                                `}
                        </style>
                        <DatePicker
                          selected={dateValue}
                          onChange={(date) =>
                            handleInputChange(
                              columnId,
                              date ? date.toISOString().slice(0, 10) : ""
                            )
                          }
                          dateFormat="yyyy-MM-dd"
                          className="input border border-gray-600/50 shadow-sm py-1 rounded-md pl-2 w-full pr-3 text-black"
                          placeholderText={`Filter by ${label}`}
                          isClearable
                          name={columnId}
                          id={columnId}
                        />
                      </div>
                    </div>
                  );
                }

                if (filterField === "select") {
                  return (
                    <div
                      key={columnId}
                      className="grid grid-cols-4 items-center gap-4"
                    >
                      <label htmlFor={columnId} className="text-right">
                        {label}
                      </label>
                      <Select
                        value={
                          filterValues[columnId] !== undefined
                            ? String(filterValues[columnId])
                            : "all"
                        }
                        onValueChange={(value) =>
                          handleInputChange(columnId, value)
                        }
                      >
                        <SelectTrigger className="col-span-3 w-full">
                          <SelectValue placeholder={`Filter by ${label}`} />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                          <SelectItem value="all">All</SelectItem>
                          {filteredItems.map((option: any) => (
                            <SelectItem
                              key={option.value ?? option.id}
                              value={String(option.value ?? option.id)}
                            >
                              {option.label ?? option.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  );
                }

                // Default to input
                return (
                  <div
                    key={columnId}
                    className="grid grid-cols-4 items-center gap-4"
                  >
                    <label htmlFor={columnId} className="text-right">
                      {label}
                    </label>
                    <Input
                      id={columnId}
                      value={filterValues[columnId] ?? ""}
                      onChange={(e) =>
                        handleInputChange(columnId, e.target.value)
                      }
                      className="col-span-3"
                      placeholder={`Filter by ${label}`}
                    />
                  </div>
                );
              })
          )}
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={handleReset} type="button">
            Reset
          </Button>
          <Button onClick={handleApply} type="button">
            Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
