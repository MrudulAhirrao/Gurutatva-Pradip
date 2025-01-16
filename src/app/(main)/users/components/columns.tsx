"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Task } from "../data/schema";  
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

export const columns: ColumnDef<Task>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "rollingno",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rolling Number" />
    ),
    cell: ({ row }) => <div className="w-[120px]">{row.getValue("rollingno")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "FullName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Full Name" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue("FullName")}
        </span>
      </div>
    ),
    enableSorting: false,
    enableHiding: true,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
