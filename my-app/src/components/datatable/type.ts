import type { ColumnDef } from "@tanstack/react-table";

export type CustomColumnDef<T> = ColumnDef<T> & {
    filterField?: 'input' | 'select' | 'daterange' | 'date';
    filteredItems?: { label: string; value: string }[];
  };