"use client";

import { useState } from "react";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";;
import { Bill } from "@/types/bill";

export const ColumnsBills: ColumnDef<Bill>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "project_id",
    header: "Project",
    cell: ({ row }) => {
      const project = row?.original?.project?.title;
      return <div>{project}</div>;
    },
  },
  {
    accessorKey: "client_id",
    header: "Client",
    cell: ({ row }) => {
      const client = row?.original?.project?.client?.name;
      return <div>{client}</div>;
    },
  },
  {
    accessorKey: "total_amount",
    header: "Total Amount",
    cell: ({ row }) => {
      const total_amount = parseFloat(row.getValue("total_amount"));
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(total_amount);

      return total_amount ? <div>{formatted}</div> : null;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      let variant:
        | "default"
        | "destructive"
        | "outline"
        | "secondary"
        | null
        | undefined = "default";
      let customClass = "";

      if (status === "pending") {
        variant = "default";
      } else if (status === "paid off") {
        variant = "default";
        customClass = "bg-green-500 text-white";
      }
      return (
        <Badge variant={variant} className={customClass}>
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const router = useRouter();
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuSeparator />
            <Button variant="ghost" onClick={() => router.push(`bills/${row.original.id}`)}>
              Detail
            </Button>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
