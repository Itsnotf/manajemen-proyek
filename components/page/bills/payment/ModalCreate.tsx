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
import { createPayment } from "@/services/payment";
import { DialogTrigger } from "@radix-ui/react-dialog";

interface ModalProofProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  IdBill: number | string;
}

export default function ModalCreatePayment({
  isOpen,
  setIsOpen,
  IdBill,
}: ModalProofProps) {
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
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

    if (!paymentAmount) {
      toast({
        title: "Error",
        description: "Please enter a payment amount.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("bill_id", IdBill.toString());
      formData.append("proof", proofFile);
      formData.append("payment_amout", paymentAmount);

      const response = await createPayment(formData);
      if (response) {
        toast({
          title: "Success",
          description: "Your payment proof has been uploaded successfully.",
        });
        setIsOpen(false);
        router.refresh();
      } else {
        throw new Error("Failed to create payment");
      }
    } catch (error) {
      console.error("Error submitting proof", error);
      toast({
        title: "Error",
        description: "Failed to submit payment proof.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      // Jika Anda ingin reload halaman, bisa aktifkan baris di bawah:
      // window.location.reload();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Payment Proof</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="paymentAmount">Payment Amount</Label>
            <Input
              id="paymentAmount"
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              placeholder="Enter payment amount"
              required
            />
          </div>
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
