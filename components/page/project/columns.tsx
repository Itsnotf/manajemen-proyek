"use client";

import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import Project from "@/types/projects";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<Project>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Project ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "client_id",
    header: "Client",
    cell: ({ row }) => {
      const client = row.original.client;
      return <div>{client ? client.name : "No Client"}</div>;
    },
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "service_price",
    header: "Service Price",
    cell: ({ row }) => {
      const service_price = parseFloat(row.getValue("service_price"));
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(service_price);
    
      return service_price ? <div>{formatted}</div> : null;
    },    
  },
  {
    accessorKey: "start_date",
    header: "Start Date",
    cell: ({ row }) => {
      const startDate = new Date(row.getValue("start_date"));
      const formattedDate = `${startDate
        .getDate()
        .toString()
        .padStart(2, "0")}/${(startDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${startDate.getFullYear().toString().slice(-2)}`;
      return <div>{formattedDate}</div>;
    },
  },
  {
    accessorKey: "end_date",
    header: "End Date",
    cell: ({ row }) => {
      const endDate = new Date(row.getValue("end_date"));
      const formattedDate = `${endDate
        .getDate()
        .toString()
        .padStart(2, "0")}/${(endDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${endDate.getFullYear().toString().slice(-2)}`;
      return <div>{formattedDate}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({row}) => {
      const status = row.original.status;
      
      return <Badge variant={status === "completed" ? "default" : "destructive"}>{status}</Badge>;
       
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { toast } = useToast();
      const project = row.original;
      const router = useRouter();
      const [open, setOpen] = useState(false);
  
      const userString = localStorage.getItem("users") || "{}";
      const userData = JSON.parse(userString);
      const role_id = userData.role_id;
      const userId = userData.id; // Ambil user id
  
      const handleDelete = async () => {
        try {
          const response = await deleteProjects(project.id);
          if (response) {
            toast({
              title: "Success",
              description: "User deleted successfully!",
              variant: "default",
            });
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to delete user. Please try again.",
            variant: "destructive",
          });
        } finally {
          window.location.reload();
        }
      };
  
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
              onClick={() => router.push(`projects/${project.id}`)}
              className="text-blue-500"
            >
              Detail
            </Button>
  
            {role_id === 1 && (
              <Button
                variant="ghost"
                onClick={() => router.push(`projects/edit/${project.id}`)}
                className="text-yellow-500"
              >
                Edit
              </Button>
            )}
  
            {role_id === 1 && (
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
                      the user <b>{project.title}</b>.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setOpen(false)}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-red-500 text-white"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  
];
