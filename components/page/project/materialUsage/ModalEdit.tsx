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
import { editMaterialUsage } from "@/services/materialUsage";
import { Material } from "@/types/material";
import Select from "react-select";
import { useRouter } from "next/navigation";
import { MaterialUsage } from "@/types/materialUsage";
import LoadingSpinner from "@/components/LoadingSpinner";

interface OptionType {
  value: number;
  label: string;
}

interface ModalEditMaterialUsageProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  data: MaterialUsage | null;
}

export default function ModalEditMaterialUsage({
  isOpen,
  setIsOpen,
  data,
}: ModalEditMaterialUsageProps) {
  const [newMaterialUsage, setNewMaterialUsage] = useState({
    material_id: "",
    quantity: "",
  });
  const [loading, setLoading] = useState(false);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchMaterials = async () => {
      setLoading(true);
      try {
        const response = await getMaterial();
        setMaterials(response.data);
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to load materials.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchMaterials();
    }
  }, [isOpen]);

  useEffect(() => {
    if (data) {
      setNewMaterialUsage({
        material_id: String(data.material_id),
        quantity: String(data.quantity),
      });

      const selected = materials.find(
        (mat) => Number(mat.id) === Number(data.material_id)
      );
      setSelectedOption(
        selected ? { value: selected.id, label: selected.title } : null
      );
    }
  }, [data, materials]);

  const options: OptionType[] = materials.map((mat) => ({
    value: mat.id,
    label: mat.title,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!data) {
      toast({
        title: "Error",
        description: "Invalid data.",
        variant: "destructive",
      });
      return;
    }

    try {
      const payload = {
        project_id : data.project_id,
        material_id: parseInt(newMaterialUsage.material_id),
        quantity: parseInt(newMaterialUsage.quantity),
      };

      await editMaterialUsage(payload, data.project_id, data.id);
      toast({
        title: "Success",
        description: "Material usage updated successfully!",
        variant: "default",
      });

      setIsOpen(false);
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update material usage. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      window.location.reload()
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Material Usage</DialogTitle>
        </DialogHeader>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="material">Material</Label>
              <Select
                id="material"
                options={options}
                value={selectedOption}
                onChange={(option) => {
                  setSelectedOption(option);
                  setNewMaterialUsage((prev) => ({
                    ...prev,
                    material_id: String(option?.value),
                  }));
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
                  setNewMaterialUsage((prev) => ({
                    ...prev,
                    quantity: e.target.value,
                  }))
                }
                value={newMaterialUsage.quantity}
                required
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
