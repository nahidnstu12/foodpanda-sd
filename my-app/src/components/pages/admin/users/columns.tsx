import { userListWithPagination } from "@/actions/user";
import type { CustomColumnDef } from "@/components/datatable/type";
import { Badge } from "@/components/ui/badge";
import {
  modalFormatToFilters,
  parseBrowserUrlToFilters,
  USERS_FIELD_TYPE_MAP,
} from "@/helpers/filterUtils";
import { selectTableState, useDatatableStore } from "@/store/datatableStore";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import DataTable from "../../../datatable";
import ToolTip from "../../../shared/tool-tip";
import { User } from "./all-users";
const statusOptions = [
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
  { label: "Suspended", value: "SUSPENDED" },
];

const verificationOptions = [
  { label: "Verified", value: "true" },
  { label: "Not Verified", value: "false" },
];
export const columns: CustomColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
    enableColumnFilter: true,
    filterField: "input",
  },
  {
    accessorKey: "email",
    header: "Email",
    enableColumnFilter: true,
    filterField: "input",
  },
  {
    accessorKey: "phone",
    header: "Phone",
    enableColumnFilter: true,
    filterField: "input",
  },
  {
    accessorKey: "status",
    header: "Status",
    enableColumnFilter: true,
    filterField: "select",
    filteredItems: statusOptions,
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const variant =
        status === "ACTIVE"
          ? "default"
          : status === "INACTIVE"
          ? "secondary"
          : "destructive";
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    accessorKey: "emailVerified",
    header: "Email Verified",
    enableColumnFilter: true,
    filterField: "select",
    filteredItems: verificationOptions,
    cell: ({ row }) => {
      const verified = row.getValue("emailVerified") as boolean;
      return (
        <Badge variant={verified ? "default" : "secondary"}>
          {verified ? "Yes" : "No"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "is_phone_verified",
    header: "Phone Verified",
    enableColumnFilter: true,
    filterField: "select",
    filteredItems: verificationOptions,
    cell: ({ row }) => {
      const verified = row.getValue("is_phone_verified") as boolean;
      return (
        <Badge variant={verified ? "default" : "secondary"}>
          {verified ? "Yes" : "No"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    enableColumnFilter: true,
    filterField: "date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return date.toLocaleDateString();
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-3">
          <ToolTip content="View Details">
            <Eye className="h-4 w-4 text-blue-600 cursor-pointer" />
          </ToolTip>
          <ToolTip content="Edit Order">
            <Pencil className="h-4 w-4 text-teal-600 cursor-pointer" />
          </ToolTip>
          <ToolTip content="Delete Order">
            <Trash2 className="h-4 w-4 text-red-600 cursor-pointer" />
          </ToolTip>
        </div>
      );
    },
  },
];
