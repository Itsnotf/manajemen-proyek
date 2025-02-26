"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { findMaterial, editMaterial } from "@/services/material";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function FormEditMaterial() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const materialId = params?.id;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submit, setSubmit] = useState(false);

  useEffect(() => {
    async function fetchMaterial() {
      setIsLoading(true);
      try {
        const material = await findMaterial(materialId);
        setTitle(material.title || "");
        setDescription(material.description || "");
        setSellPrice(material.sell_price ? String(material.sell_price) : "");
        setPurchasePrice(
          material.purchase_price ? String(material.purchase_price) : ""
        );
        setQuantity(material.quantity ? String(material.quantity) : "");
      } catch (error) {
        console.error("Error fetching material:", error);
        toast({
          title: "Error",
          description: "Failed to fetch material data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    if (materialId) {
      fetchMaterial();
    }
  }, [materialId, toast]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
    setSubmit(true);
    try {
      const materialData = {
        title,
        description,
        sell_price: Number(sellPrice),
        purchase_price: purchasePrice ? Number(purchasePrice) : null,
        quantity: Number(quantity),
      };

      const response = await editMaterial(materialData, materialId);
      toast({
        title: "Success",
        description: response.message || "Material updated successfully!",
        variant: "default",
      });
      router.push("/materials");
    } catch (error) {
      console.error("Error updating material:", error);
      toast({
        title: "Error",
        description: "Failed to update material. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmit(false);
    }
  };

  {
    return isLoading ? (
      <LoadingSpinner />
    ) : (
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
              <Input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter material description"
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
            <Button type="submit">
              {submit ? "Submiting.." : "Update Material"}
            </Button>
          </div>
        </form>
      </div>
    );
  }
}
