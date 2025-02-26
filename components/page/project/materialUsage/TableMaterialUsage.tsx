"use client";

import * as React from "react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import Project from "@/types/projects";
import User from "@/types/users";
import { MaterialUsage } from "@/types/materialUsage";
import ModalCreateMaterialUsage from "./ModalCreate";
import ModalEditMaterialUsage from "./ModalEdit";

interface DataTableProps {
  columns: ColumnDef<MaterialUsage, any>[];
  data: MaterialUsage[];
  user: User | null;
  projectId: any;
}

export function TableMaterialUsage({
  columns,
  data,
  user,
  projectId,
}: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [isOpenMaterial, setIsOpenMaterial] = React.useState(false);

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 5,
      },
    },
  });

  return (
    <div className="">
      <ModalCreateMaterialUsage
        isOpen={isOpenMaterial}
        projectId={projectId}
        setIsOpen={setIsOpenMaterial}
      />

      <div className="flex py-4 justify-between items-center">
        <Input
          placeholder="Filter material id..."
          value={(table.getColumn("id")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("id")?.setFilterValue(event.target.value)
          }
          className="max-w-xs"
        />
        {user?.role_id === 1 || user?.role_id === 3 ? (
          <Button onClick={() => setIsOpenMaterial(true)}>
            Create Material
          </Button>
        ) : null}
      </div>
      <Table className="rounded-xl border">
        {/* Table Header */}
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        {/* Table Body */}
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                className="hover:bg-gray-100 cursor-pointer"
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>

        {/* Table Footer */}
        <TableFooter>
          <TableRow>
            <TableCell colSpan={columns.length} className="text-center py-3 ">
              <div className="flex justify-between items-center mx-5">
                <span className="text-gray-500 text-sm">
                  Total data {data.length}
                </span>
                <span className="text-gray-500 text-sm">
                  Showing page {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()}
                </span>
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
