import type { CustomColumnDef } from '@/components/datatable/type';
import { Eye, Pencil, ShieldCheck, Trash2 } from 'lucide-react';
import ToolTip from '../../../shared/tool-tip';
import { AppUser } from './list';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export const usersColumns: CustomColumnDef<AppUser>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    enableColumnFilter: true,
    filterField: 'input',
  },
  {
    accessorKey: 'email',
    header: 'Email',
    enableColumnFilter: true,
    filterField: 'input',
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
    enableColumnFilter: true,
    filterField: 'input',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    enableColumnFilter: true,
    filterField: 'select',
    filteredItems: [
      { label: 'Active', value: 'ACTIVE' },
      { label: 'Inactive', value: 'INACTIVE' },
      { label: 'Suspended', value: 'SUSPENDED' },
    ],
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const variant =
        status === 'ACTIVE'
          ? 'default'
          : status === 'INACTIVE'
          ? 'secondary'
          : 'destructive';
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <ToolTip content="View Details">
          <Eye className="h-4 w-4 text-blue-600 cursor-pointer" />
        </ToolTip>
        <ToolTip content="Edit">
          <Pencil className="h-4 w-4 text-teal-600 cursor-pointer" />
        </ToolTip>
        <ToolTip content="Assign Permissions">
          <Link href={`users/${row.original.id}/permissions`}>
            <ShieldCheck className="h-4 w-4 text-emerald-600 cursor-pointer" />
          </Link>
        </ToolTip>
        <ToolTip content="Delete">
          <Trash2 className="h-4 w-4 text-red-600 cursor-pointer" />
        </ToolTip>
      </div>
    ),
  },
];
