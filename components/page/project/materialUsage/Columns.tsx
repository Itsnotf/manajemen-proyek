"use client";

import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { deleteProjects } from "@/services/projects";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState, useCallback, useEffect } from "react";
import { MaterialUsage } from "@/types/materialUsage";
import { Badge } from "@/components/ui/badge";
import ModalEditMaterialUsage from "./ModalEdit";
import {
  deleteMaterialUsage,
  findMaterialUsage,
} from "@/services/materialUsage";

export const ColumnsMaterialUsage: ColumnDef<MaterialUsage>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Material Usage ID
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "material_id",
    header: "Material",
    cell: ({ row }) => {
      const material = row.original.material;
      return <div>{material?.title ?? "No Material"}</div>;
    },
  },
  {
    accessorKey: "project_id",
    header: "Project",
    cell: ({ row }) => {
      const project = row.original.project;
      return <div>{project?.title ?? "No Project"}</div>;
    },
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={
          row.original.status === "available" ? "default" : "destructive"
        }
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { toast } = useToast();
      const material = row.original;
      const router = useRouter();
      const [open, setOpen] = useState(false);
      const [isOpenMaterialEdit, setIsOpenMaterialEdit] = useState(false);
      const [data, setData] = useState<MaterialUsage | null>(null);
      const [isLoading, setIsLoading] = useState(false);
      const [error, setError] = useState("");

      const handleDelete = useCallback(async () => {
        try {
          const response = await deleteMaterialUsage(
            material.project_id,
            material.id
          );
          if (response) {
            toast({
              title: "Success",
              description: "Material usage deleted successfully!",
              variant: "default",
            });
            window.location.reload();
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to delete material usage. Please try again.",
            variant: "destructive",
          });
        } finally {
          setOpen(false);
        }
      }, [material.project_id, toast, router]);

      useEffect(() => {
        const fetchMaterialUsageData = async () => {
          try {
            const response = await findMaterialUsage(
              material.project_id,
              material.id
            );

            if (response?.data) {
              setData(response.data);
            } else {
              setError("No data found for the given material usage.");
            }
          } catch (err) {
            setError("Failed to load material usage data.");
            console.error(err);
          }
        };

        if (isOpenMaterialEdit) {
          fetchMaterialUsageData();
        }
      }, [isOpenMaterialEdit]);

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
            <Button
              variant="ghost"
              onClick={() => setIsOpenMaterialEdit(true)}
              className="text-yellow-500"
            >
              Edit
            </Button>

            <ModalEditMaterialUsage
              isOpen={isOpenMaterialEdit}
              setIsOpen={setIsOpenMaterialEdit}
              data={data}
            />

            <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" className="text-red-500 cursor-pointer">
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the material usage for <b>{material.project?.title}</b>.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-red-500 text-white"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
