import type { CustomColumnDef } from "@/components/datatable/type";
import { Eye, Pencil, Trash2 } from "lucide-react";
import ToolTip from "../../../shared/tool-tip";
import { Role } from "./list";

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
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-3">
          <ToolTip content="View Details">
            <Eye className="h-4 w-4 text-blue-600 cursor-pointer" />
          </ToolTip>
          <ToolTip content="Edit">
            <Pencil className="h-4 w-4 text-teal-600 cursor-pointer" />
          </ToolTip>
          <ToolTip content="Delete">
            <Trash2 className="h-4 w-4 text-red-600 cursor-pointer" />
          </ToolTip>
        </div>
      );
    },
  },
];
