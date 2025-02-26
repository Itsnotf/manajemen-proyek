"use client"
import React, { useEffect, useState } from "react";
import { TableMaterial } from "./TableMaterial";
import { ColumnsMaterial } from "./Columns";
import LoadingSpinner from "@/components/LoadingSpinner";
import { getMaterial } from "@/services/material";
import { useRouter } from "next/navigation";

export default function MaterialPage() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter()

  
  useEffect(() => {
    const userString = localStorage.getItem("users") || "{}";
    const user = JSON.parse(userString);
      if (user && ![1, 2].includes(user.role_id)) {
        router.push('/dashboard');
      }
    }, [router]);

  useEffect(() => {
    const fetchMaterial = async () => {
      setIsLoading(true);
      try {
        const Material = await getMaterial();
        setData(Material.data);
      } catch (err) {
        setError("Failed to load Material.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMaterial();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }
  return isLoading ? (
    <LoadingSpinner />
  ) : (
    <div>
      <TableMaterial columns={ColumnsMaterial} data={data} />
    </div>
  );
}
