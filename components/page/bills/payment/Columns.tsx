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
import { useRouter } from "next/navigation";
import { Bill } from "@/types/bill";
import { Payment } from "@/types/payment";

export const ColumnsPayment: ColumnDef<Payment>[] = [
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
    accessorKey: "bill_id",
    header: "Bill Project",
    cell: ({row}) => {
        const project = row.original.bill.project?.title
        console.log(project);
        
        return <div>{project}</div>
    }
  },
  {
    accessorKey: "payment_amout",
    header: "Payment Amount",
    cell: ({ row }) => {
        const payment_amout = parseFloat(row.getValue("payment_amout"));
        const formatted = new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
        }).format(payment_amout);
      
        return payment_amout ? <div>{formatted}</div> : null;
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
];
