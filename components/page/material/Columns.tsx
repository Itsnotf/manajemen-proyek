"use client";

import { useState } from "react";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import User from "@/types/users";
import { useToast } from "@/hooks/use-toast";
import { deleteUsers } from "@/services/users";
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
import { Material } from "@/types/material";
import { deleteMaterial } from "@/services/material";
import { Label } from "@/components/ui/label";
import ModalCreatePurchaseOrder from "./ModalPurchaseOrder";

export const ColumnsMaterial: ColumnDef<Material>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Material ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "sell_price",
    header: "Sell Price",
    cell: ({ row }) => {
        const sell_price = parseFloat(row.getValue("sell_price"));
        const formatted = new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
        }).format(sell_price);
      
        return sell_price ? <div>{formatted}</div> : null;
      },    
  },
  {
    accessorKey: "purchase_price",
    header: "Purchase Price",
    cell: ({ row }) => {
        const purchase_price = parseFloat(row.getValue("purchase_price"));
        const formatted = new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
        }).format(purchase_price);
      
        return purchase_price ? <div>{formatted}</div> : null;
      },    
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => {
      const material = row.original;

      // Hitung total quantity dengan status "not available"
      const totalNotAvailable = material.usages
        .filter((usage) => usage.status === "not available")
        .reduce((sum, usage) => sum + usage.quantity, 0);

      // Hitung remaining quantity
      const remainingQuantity = totalNotAvailable - material.quantity;

      return (
        <div className="flex items-center justify-start">
          <Label>{material.quantity}</Label>
          {remainingQuantity > 0 && (
            <div className="text-red-500 text-xs mx-1 flex items-center">
              <ArrowUpDown size={14} className="text-red-500" />
              {remainingQuantity}
            </div>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const material = row.original;
      const { toast } = useToast();
      const [open, setOpen] = useState(false);
      const [openPurchase, setOpenPurchase] = useState(false);

      const handleDelete = async () => {
        try {
          const response = await deleteMaterial(material.id);
          if (response) {
            toast({
              title: "Success",
              description: "Material deleted successfully!",
              variant: "default",
            });
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to delete material. Please try again.",
            variant: "destructive",
          });
        } finally {
          setOpen(false);
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
            <Link href={`materials/edit/${material.id}`}>
              <Button variant="ghost" className="text-yellow-500">
                Edit
              </Button>
            </Link>
            <Button variant="ghost" className="text-blue-500" onClick={() => setOpenPurchase(true)}>
              Order
            </Button>

            <ModalCreatePurchaseOrder
              isOpen={openPurchase}
              setIsOpen={setOpenPurchase}
              materialId={material.id}
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
                    the user <b>{material.title}</b>.
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
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
