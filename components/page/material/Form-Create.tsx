"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { createMaterial } from "@/services/material";
import { Textarea } from "@/components/ui/textarea";

export default function FormCreateMaterial() {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validasi field yang diperlukan
    const requiredFields = [
      { value: title, message: "Please enter a title." },
      { value: description, message: "Please enter a description." },
      { value: sellPrice, message: "Please enter a sell price." },
      { value: quantity, message: "Please enter a quantity." },
    ];

    for (const { value, message } of requiredFields) {
      if (!value) {
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
        return;
      }
    }

    try {
      const materialData = {
        title,
        description,
        sell_price: Number(sellPrice),
        purchase_price: purchasePrice ? Number(purchasePrice) : null,
        quantity: Number(quantity),
      };

      const response = await createMaterial(materialData);
      toast({
        title: "Success",
        description: response.message || "Material created successfully!",
        variant: "default",
      });
      router.push("/materials"); // Redirect ke halaman daftar material
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Failed to create material. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter material title"
            />
          </div>
          <div>
            <Label htmlFor="sellPrice">Sell Price</Label>
            <Input
              type="number"
              id="sellPrice"
              value={sellPrice}
              onChange={(e) => setSellPrice(e.target.value)}
              placeholder="Enter sell price"
            />
          </div>
          <div>
            <Label htmlFor="purchasePrice">Purchase Price</Label>
            <Input
              type="number"
              id="purchasePrice"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              placeholder="Enter purchase price"
            />
          </div>
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity"
            />
          </div>
          <div className="col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter project description"
            />
          </div>
        </div>
        <div className="flex justify-between">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/materials")}
          >
            Back
          </Button>
          <Button type="submit">Create Material</Button>
        </div>
      </form>
    </div>
  );
}
