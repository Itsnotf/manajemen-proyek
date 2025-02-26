"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { addPurchaseOrder } from "@/services/purchaseOrder";
// Misalnya, addPurchaseOrder adalah service untuk menambah purchase order

interface ModalCreatePurchaseOrderProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  materialId : number
}


export default function ModalCreatePurchaseOrder({
  isOpen,
  setIsOpen,
  materialId,
}: ModalCreatePurchaseOrderProps) {
  const [unitPrice, setUnitPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [vendor, setVendor] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
const userString = localStorage.getItem("users") || "{}";
const user = JSON.parse(userString);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = {
      requested_by: user.id,
      material_id: materialId,
      unit_price: parseFloat(unitPrice),
      quantity: parseInt(quantity),
      vendor,
    };

    setIsLoading(true);
    try {
      const response = await addPurchaseOrder(data);
      toast({
        title: "Purchase Order added successfully",
        description: response.message || 'Purchase Order added successfully ',
      });
      setIsOpen(false);
    } catch (error: any) {
      console.error("Error creating purchase order", error);
      toast({
        title: "Error",
        description: "Failed to create purchase order",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      window.location.reload();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Purchase Order</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label>Unit Price</Label>
            <Input
              type="number"
              step="0.01"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
              placeholder="Enter unit price"
              required
            />
          </div>
          <div>
            <Label>Quantity</Label>
            <Input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity"
              required
            />
          </div>
          <div>
            <Label>Vendor</Label>
            <Input
              type="text"
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              placeholder="Enter vendor name"
              required
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
