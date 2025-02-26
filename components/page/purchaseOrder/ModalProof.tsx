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
import { useRouter } from "next/navigation";
import axios from "axios";

interface ModalProofProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  purchaseOrderId: number | string;
}

export default function ModalProof({ isOpen, setIsOpen, purchaseOrderId }: ModalProofProps) {
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validasi ekstensi file
      const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Error",
          description: "Invalid file type. Only JPG, PNG, or PDF are allowed.",
          variant: "destructive",
        });
        return;
      }

      // Validasi ukuran file (maksimal 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "File size exceeds 2MB limit.",
          variant: "destructive",
        });
        return;
      }

      setProofFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!proofFile) {
      toast({
        title: "Error",
        description: "Please select a valid file.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User not authenticated");
      }

      const formData = new FormData();
      formData.append("proof", proofFile);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/purchaseOrder/completed/${purchaseOrderId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data) {
        toast({
          title: "Success",
          description: "Your proof has been uploaded successfully.",
        });
        setIsOpen(false);
        router.refresh();
      } else {
        throw new Error("Failed to submit proof");
      }
    } catch (error) {
      console.error("Error submitting proof", error);
      toast({
        title: "Error",
        description: "Failed to submit proof.",
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
          <DialogTitle>Upload Proof</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="proof">Proof (Image or PDF)</Label>
            <Input
              id="proof"
              type="file"
              accept=".jpg, .jpeg, .png, .pdf"
              onChange={handleFileChange}
              required
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Uploading..." : "Submit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
