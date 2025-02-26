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

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { ColumnDef } from "@tanstack/react-table";
import { PurchaseOrder } from "@/types/purchaseOrder";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/router";
import {
  approvePurchaseOder,
  completedPurchaseOrder,
  notApprovePurchaseOder,
} from "@/services/purchaseOrder";
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog";
import ModalProof from "./ModalProof";

export const ColumnsPurchaseOrder: ColumnDef<PurchaseOrder>[] = [
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
    accessorKey: "material_id",
    header: "Material",
    cell: ({row}) => {
        const material = row.original.material.title
        return <div>{material}</div>;
    }
  },
  {
    accessorKey: "requested_by",
    header: "Requested",
    cell: ({ row }) => {
      const requested = row.original;

      return <div>{requested.requested_by.name}</div>;
    },
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "vendor",
    header: "Vendor",
  },
  {
    accessorKey: "unit_price",
    header: "Unit Price",
    cell: ({ row }) => {
        const unit_price = parseFloat(row.getValue("unit_price"));
        const formatted = new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
        }).format(unit_price);
      
        return unit_price ? <div>{formatted}</div> : null;
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
      } else if (status === "not approved") {
        variant = "destructive";
      } else if (status === "approved") {
        // Gunakan variant default (atau variant lain yang sesuai) dan override styling dengan className
        variant = "default";
        customClass = "bg-yellow-500 text-white";
      } else if (status === "completed") {
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
    accessorKey: "proof",
    header: "Proof",
    cell: ({ row }) => {
      const API_SAC = process.env.NEXT_PUBLIC_API_URL_WEB;
      const proof = row.original.proof;

      if (!proof) {
        return <span className="text-gray-400">No Proof</span>; // Menampilkan teks jika proof kosong
      }

      const proofUrl = `${API_SAC}/storage/${proof}`;

      return (
        <Button variant="link" onClick={() => window.open(proofUrl, "_blank")}>
          Proof
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { toast } = useToast();
      const purchaseOrderId = row.original.id;
      const status = row.original.status;
      const [openApprove, setOpenApprove] = useState(false);
      const [openReject, setOpenReject] = useState(false);
      const [openProof, setOpenProof] = useState(false);
  
      const userString = localStorage.getItem("users") || "{}";
      const user = JSON.parse(userString);
  
      const handleApprove = async () => {
        try {
          const response = await approvePurchaseOder(purchaseOrderId, user.id);
          toast({
            title: "Purchase Order Approved",
            description: response.message || "The purchase order has been approved.",
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to approve the purchase order.",
            variant: "destructive",
          });
        } finally {
          window.location.reload();
          setOpenApprove(false);
        }
      };
  
      const handleReject = async () => {
        try {
          const response = await notApprovePurchaseOder(purchaseOrderId, user.id);
          toast({
            title: "Purchase Order Rejected",
            description: response.message || "The purchase order has been rejected.",
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to reject the purchase order.",
            variant: "destructive",
          });
        } finally {
          setOpenReject(false);
          window.location.reload();
        }
      };
  
      return (
        <>
          {/* Render buttons based on user role_id */}
          {user.role_id === 1 && status === "pending" && (
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
                  className="text-green-500"
                  onClick={() => setOpenApprove(true)}
                >
                  Approve
                </Button>
                <Button
                  variant="ghost"
                  className="text-red-500"
                  onClick={() => setOpenReject(true)}
                >
                  Reject
                </Button>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
  
          {user.role_id === 2 && status === "approved" && (
            <Button
              variant="ghost"
              className="text-blue-500"
              onClick={() => setOpenProof(true)}
            >
              Send Proof
            </Button>
          )}
  
          {/* Alert dialog for Approve */}
          <AlertDialog open={openApprove} onOpenChange={setOpenApprove}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Approval</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleApprove}
                  className="bg-green-500 text-white"
                >
                  Approve
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
  
          {/* Alert dialog for Reject */}
          <AlertDialog open={openReject} onOpenChange={setOpenReject}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Rejection</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleReject}
                  className="bg-red-500 text-white"
                >
                  Reject
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
  
          <ModalProof
            isOpen={openProof}
            setIsOpen={setOpenProof}
            purchaseOrderId={purchaseOrderId}
          />
        </>
      );
    },
  }  
];
