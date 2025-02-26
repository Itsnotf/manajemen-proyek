"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { getMaterial } from "@/services/material";
import { createMaterialUsage } from "@/services/materialUsage";
import { Material } from "@/types/material";
import Select from "react-select";

interface OptionType {
  value: number;
  label: string;
}

interface ModalCreateMaterialUsageProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  projectId: string;
}

export default function ModalCreateMaterialUsage({
  isOpen,
  setIsOpen,
  projectId,
}: ModalCreateMaterialUsageProps) {
  const [newMaterialUsage, setNewMaterialUsage] = useState({
    material_id: "",
    quantity: "",
  });
  const [loading, setLoading] = useState(false);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);
  const [error, setError] = useState("");

  // Fetch semua material ketika komponen dimount
  useEffect(() => {
    const fetchMaterials = async () => {
      setLoading(true);
      try {
        const response = await getMaterial();
        // Asumsi response.data berisi array of Material
        setMaterials(response.data);
      } catch (err) {
        setError("Failed to load material.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMaterials();
  }, []);

  // Siapkan opsi untuk react-select dari data material
  const options: OptionType[] = materials.map((mat) => ({
    value: mat.id,
    label: mat.title,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Payload untuk createMaterialUsage
      const payload = {
        material_id: Number(newMaterialUsage.material_id),
        project_id: Number(projectId),
        quantity: Number(newMaterialUsage.quantity),
      };

      const response = await createMaterialUsage(projectId, payload);
      toast({
        title: "Success",
        description:
          response.message || "Material usage created successfully!",
        variant: "default",
      });
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to create material usage:", error);
      toast({
        title: "Error",
        description: "Failed to create material usage. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Material Usage</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="material">Material</Label>
            <Select
              id="material"
              options={options}
              value={selectedOption}
              onChange={(option) => {
                setSelectedOption(option);
                setNewMaterialUsage({
                  ...newMaterialUsage,
                  material_id: String(option?.value),
                });
              }}
              placeholder="Select Material..."
            />
          </div>
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              name="quantity"
              type="number"
              placeholder="Enter quantity"
              onChange={(e) =>
                setNewMaterialUsage({
                  ...newMaterialUsage,
                  quantity: e.target.value,
                })
              }
              value={newMaterialUsage.quantity}
              required
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit">
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
