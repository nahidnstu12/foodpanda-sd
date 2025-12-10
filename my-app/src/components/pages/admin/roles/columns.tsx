import type { CustomColumnDef } from "@/components/datatable/type";
import { Eye, Pencil, ShieldCheck, Trash2 } from "lucide-react";
import ToolTip from "../../../shared/tool-tip";
import { Role } from "./list";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export const rolesColumns: CustomColumnDef<Role>[] = [
  {
    accessorKey: "name",
    header: "Name",
    enableColumnFilter: true,
    filterField: "input",
  },
  {
    accessorKey: "key",
    header: "Key",
    enableColumnFilter: true,
    filterField: "input",
  },
  {
    accessorKey: "description",
    header: "Description",
    enableColumnFilter: true,
    filterField: "input",
  },
  {
    accessorKey: "status",
    header: "Status",
    enableColumnFilter: true,
    filterField: "select",
    filteredItems: [
      { label: "Active", value: "ACTIVE" },
      { label: "Inactive", value: "INACTIVE" },
      { label: "Suspended", value: "SUSPENDED" },
      { label: "Deleted", value: "DELETED" },
    ],
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
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      const meta: any = table.options.meta;
      return (
        <div className="flex items-center gap-3">
          {meta?.canChangeView && (
            <ToolTip content="View Details">
              <Eye className="h-4 w-4 text-blue-600 cursor-pointer" />
            </ToolTip>
          )}
          {meta?.canChangeUpdate && (
            <ToolTip content="Edit">
              <Pencil className="h-4 w-4 text-teal-600 cursor-pointer" />
            </ToolTip>
          )}

          {meta?.canChangePermission && (
            <ToolTip content="Assign Permissions">
              <Link href={`roles/${row.original.id}/permissions`}>
                <ShieldCheck className="h-4 w-4 text-emerald-600 cursor-pointer" />
              </Link>
            </ToolTip>
          )}

          {meta?.canChangeDelete && (
            <ToolTip content="Delete">
              <Trash2 className="h-4 w-4 text-red-600 cursor-pointer" />
            </ToolTip>
          )}
        </div>
      );
    },
  },
];
