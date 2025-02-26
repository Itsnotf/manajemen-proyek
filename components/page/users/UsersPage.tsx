"use client";
import React, { useEffect, useState } from "react";
import { TableUsers } from "./TableUsers";
import LoadingSpinner from "@/components/LoadingSpinner";
import { getUsers } from "@/services/users";
import { ColumnsUsers } from "./Columns";
import { useRouter } from "next/navigation";

export default function UsersPage() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();


  useEffect(() => {
    const userString = localStorage.getItem("users") || "{}";
    const user = JSON.parse(userString);

    if (user && ![1].includes(user.role_id)) {
      router.push("/dashboard");
    }
  }, [router]);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const Users = await getUsers();
        setData(Users);
      } catch (err) {
        setError("Failed to load Users.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }
  return isLoading ? (
    <LoadingSpinner />
  ) : (
    <div>
      <TableUsers columns={ColumnsUsers} data={data} />
    </div>
  );
}
