"use client"

import React, { useEffect, useState } from "react";
import { TableProject } from "./TableProject";
import { columns } from "./columns";
import { getProjects } from "@/services/projects";
import LoadingSpinner from "@/components/LoadingSpinner";
import Project from "@/types/projects";
import User from "@/types/users";
import { useRouter } from "next/navigation";

export default function ProjectsPage() {
  const router = useRouter()
  const [data, setData] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);


  useEffect(() => {
    const userString = localStorage.getItem("users") || "{}";
    setUser(JSON.parse(userString));
  }, []);
  
  useEffect(() => {
    if (user && ![1, 3, 4].includes(user.role_id)) {
      router.push('/dashboard');
    }
  }, [user, router]);
  
  
  const filteredData =
    user?.role_id === 1
      ? data
      : data.filter((project) =>
          project.stakeholders.some(
            (stakeholder) =>  Number(stakeholder.id) ===  Number(user?.id) || Number(project.client_id) === Number(user?.id)
          )
        );
  
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const projects = await getProjects();
        setData(projects);
      } catch (err) {
        setError("Failed to load projects.");
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
      <TableProject columns={columns} data={filteredData} user={user} />
    </div>
  );
}
