"use client";

import React, { useEffect, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { TablePurchaseOrder } from "./TablePurchaseOrder";
import { ColumnsPurchaseOrder } from "./Columns";
import { getPurchaseOder } from "@/services/purchaseOrder";
import { PurchaseOrder } from "@/types/purchaseOrder";
import { useRouter } from "next/navigation";

export default function PurchaseOrderPage() {
  const [data, setData] = useState<PurchaseOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  
  useEffect(() => {
    const userString = localStorage.getItem("users") || "{}";
    const userData = JSON.parse(userString);
    if (userData && ![1, 2].includes(userData.role_id)) {
      router.push("/dashboard");
    }
  }, [router]);

  useEffect(() => {
    const fetchPurchaseOrder = async () => {
      setIsLoading(true);
      try {
        const PurchaseOder = await getPurchaseOder();
        setData(PurchaseOder.data);
      } catch (err) {
        setError("Failed to load Purchase Oder.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPurchaseOrder();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }
  return isLoading ? (
    <LoadingSpinner />
  ) : (
    <div>
      <TablePurchaseOrder columns={ColumnsPurchaseOrder} data={data} />
    </div>
  );
}
