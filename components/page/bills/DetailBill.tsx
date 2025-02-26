"use client"
import LoadingSpinner from "@/components/LoadingSpinner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { findBill } from "@/services/bill";
import { findPayment } from "@/services/payment";
import { Bill } from "@/types/bill";
import { Payment } from "@/types/payment";
import User from "@/types/users";
import { useParams } from "next/navigation";
import React, { useEffect, useState, useMemo } from "react";
import { TablePayment } from "./payment/TablePayment";
import { ColumnsPayment } from "./payment/Columns";
import { Progress } from "@/components/ui/progress";
import { user } from "@/services/auth";

export default function DetailBill() {
  const [data, setData] = useState<Bill | null>(null);
  const [payment, setPayment] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const id = useParams().id;

  const userString = localStorage.getItem("users") || "{}";
  const userData = JSON.parse(userString);

  useEffect(() => {
    const fetchBill = async () => {
      setIsLoading(true);
      try {
        const bill = await findBill(id);
        setData(bill.data);
      } catch (err) {
        setError("Failed to load Bill.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBill();
  }, [id]);

  useEffect(() => {
    const fetchPayment = async () => {
      setIsLoading(true);
      try {
        if (data?.id) {
          const payments = await findPayment(data.id);
          console.log("Payments response:", payments);
          setPayment(payments?.data);
        }
      } catch (err) {
        setError("Failed to load Bill.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayment();
  }, [data?.id]);

  const totalPaid = useMemo(() => {
    return payment.reduce((sum, item) => sum + item.payment_amout, 0);
  }, [payment]);

  
  const progress = useMemo(() => {
      const totalAmount = Number(data?.total_amount) || 0;
      if (totalAmount === 0) return 0;
      const percentage = (totalPaid / totalAmount) * 100;
      return percentage > 100 ? 100 : Math.round(percentage);
    }, [data?.total_amount, totalPaid]);
  
    const formatRupiah = (amount: number) => 
        new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
        }).format(amount);

      

  return isLoading ? (
    <LoadingSpinner />
  ) : (
    <>
      <Card className="grid grid-cols-12">
        <CardHeader className="col-span-12">
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Payment Progress</Label>
              <Label>{progress}%</Label>
            </div>
            <Progress value={progress} />
          </div>
        </CardHeader>
        <CardContent className="col-span-12">
          <div>
            <Label>Client</Label>
            <Input value={data?.project.client.name || ""} disabled />
          </div>
          <div>
            <Label>Project</Label>
            <Input value={data?.project.title || ""} disabled />
          </div>
          <div>
            <Label>Total Amount</Label>
            <Input value={formatRupiah(Number(data?.total_amount))} disabled />
          </div>
          <div>
            <Label>Remaining Payment</Label>
            <Input value={formatRupiah((data?.total_amount || 0) - totalPaid)} disabled />
          </div>
          <div>
            <Label>Status</Label>
            <Input value={data?.status || ""} disabled />
          </div>
        </CardContent>
      </Card>

      <TablePayment columns={ColumnsPayment} data={payment} role_id={userData.role_id} />
    </>
  );
}
