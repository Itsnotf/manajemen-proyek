"use client";

import React, { useEffect, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Bill } from "@/types/bill";
import { TableBill } from "./TableBills";
import { ColumnsBills } from "./Columns";
import { getBill } from "@/services/bill";
import { useRouter } from "next/navigation";

export default function BillPage() {
  const [data, setData] = useState<Bill[]>([]);
  const [filteredData, setFilteredData] = useState<Bill[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Start loading state as true
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<{ role_id?: number; id?: number }>({});

  const router = useRouter();

  useEffect(() => {
    const userString = localStorage.getItem("users") || "{}";
    const user = JSON.parse(userString);
    setUserData(user);

    // Check role after userData is set
    if (user.role_id && ![1, 2, 4].includes(user.role_id)) {
      router.push("/dashboard");
    }
  }, [router]);

  useEffect(() => {
    const fetchBill = async () => {
      setIsLoading(true);
      try {
        const billResponse = await getBill();
        const allBills = billResponse.data;

        if (userData.role_id) {
          if ([1, 2].includes(userData.role_id)) {
            setFilteredData(allBills);
          } else {
            const filteredBills = allBills.filter(
              (bill: any) => bill.project.client_id === userData.id
            );
            setFilteredData(filteredBills);
          }
          setData(allBills);
        }
      } catch (err) {
        setError("Failed to load Bill.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch bills if userData is set
    if (userData.role_id) {
      fetchBill();
    }
  }, [userData]); // Fetch bills when userData changes

  if (error) {
    return <div>{error}</div>;
  }

  return isLoading ? (
    <LoadingSpinner />
  ) : (
    <div>
      <TableBill columns={ColumnsBills} data={filteredData} />
    </div>
  );
}
