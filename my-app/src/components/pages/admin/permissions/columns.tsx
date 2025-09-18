import type { CustomColumnDef } from "@/components/datatable/type";
import { Eye, Pencil, Trash2 } from "lucide-react";
import ToolTip from "../../../shared/tool-tip";
import { Permission } from "./list";
import type { Table } from "@tanstack/react-table";

export type PermissionRowActionHandlers = {
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export const permissionsColumns: CustomColumnDef<Permission>[] = [
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
    accessorKey: "group",
    header: "Group",
    enableColumnFilter: true,
    filterField: "input",
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }: { row: any; table: Table<Permission> }) => {
      const handlers = (table?.options?.meta ??
        ({} as any)) as PermissionRowActionHandlers;
      return (
        <div className="flex items-center gap-3">
          <ToolTip content="View Details">
            <Eye
              className="h-4 w-4 text-blue-600 cursor-pointer"
              onClick={() => handlers.onView?.(row.original.id)}
            />
          </ToolTip>
          <ToolTip content="Edit">
            <Pencil
              className="h-4 w-4 text-teal-600 cursor-pointer"
              onClick={() => handlers.onEdit?.(row.original.id)}
            />
          </ToolTip>
          <ToolTip content="Delete">
            <Trash2
              className="h-4 w-4 text-red-600 cursor-pointer"
              onClick={() => handlers.onDelete?.(row.original.id)}
            />
          </ToolTip>
        </div>
      );
    },
  },
];
