"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  createProjects,
  editProjects,
  findProjects,
} from "@/services/projects";
import { useToast } from "@/hooks/use-toast";
import Project from "@/types/projects";
import LoadingSpinner from "@/components/LoadingSpinner";
import { getUsers } from "@/services/users";
import User from "@/types/users";

const Select = dynamic(() => import("react-select"), { ssr: false });

export default function FormEditProject() {
  const { toast } = useToast();
  const { id } = useParams();
  const router = useRouter();

  const [clientId, setClientId] = useState<{
    value: string;
    label: string;
  } | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [servicePrice, setServicePrice] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[] | null>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const usersData = await getUsers();
        setUsers(usersData);
      } catch (err) {
        setError("Failed to load users.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const clientOptions = users
    ?.filter((user: any) => user.role_id === 4)
    .map((client: any) => ({
      value: client.id.toString(),
      label: client.name,
    }));

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const projectData = await findProjects(id);
        setData(projectData.project);
      } catch (error) {
        console.error("Failed to fetch project:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (!data) return;

    setTitle(data.title || "");
    setDescription(data.description || "");
    setServicePrice(data.service_price || "");
    setStartDate(data.start_date || "");
    setEndDate(data.end_date || "");
    if (data?.client.id) {
      const selectedOption = clientOptions?.find(
        (option) => option.value === data.client.id
      );
      setClientId(selectedOption || null);
    }
  }, [data]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const requiredFields = [
      { value: clientId, message: "Please select a client." },
      { value: title, message: "Please enter a project title." },
      { value: servicePrice, message: "Please enter a service price." },
      { value: startDate, message: "Please select a start date." },
      { value: endDate, message: "Please select an end date." },
      { value: description, message: "Please enter a project description." },
    ];

    for (const { value, message } of requiredFields) {
      if (!value) {
        toast({ title: "Error", description: message, variant: "destructive" });
        return;
      }
    }

    try {
      const formData = new FormData();
      formData.append("client_id", clientId?.value || "");
      formData.append("title", title);
      formData.append("description", description);
      if (file) formData.append("file", file);
      formData.append("service_price", servicePrice);
      formData.append("start_date", startDate);
      formData.append("end_date", endDate);
      formData.append("_method", "PUT");

      if (id) {
        const response = await editProjects(formData, id);
        toast({
          title: "Success",
          description: response.message || "Project updated successfully!",
          variant: "default",
        });
        router.push("/projects");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Failed to process the project. Please try again.",
        variant: "destructive",
      });
    }
  };

  return isLoading ? (
    <LoadingSpinner />
  ) : (
    <div className="p-4 md:p-6">
    <form
      className="space-y-4"
      onSubmit={handleSubmit}
      encType="multipart/form-data"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="client_id">Client</Label>
          <Select
            options={clientOptions}
            value={clientId}
            onChange={(selectedOption) =>
              setClientId(selectedOption as { value: string; label: string })
            }
            placeholder="Select a client"
            className="w-full"
          />
        </div>
        <div>
          <Label htmlFor="file">Upload File</Label>
          <Input
            type="file"
            id="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter project title"
          />
        </div>
        <div>
          <Label htmlFor="start_date">Start Date</Label>
          <Input
            type="date"
            id="start_date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="service_price">Service Price</Label>
          <Input
            type="number"
            id="service_price"
            value={servicePrice}
            onChange={(e) => setServicePrice(e.target.value)}
            placeholder="Enter service price"
          />
        </div>
        <div>
          <Label htmlFor="end_date">End Date</Label>
          <Input
            type="date"
            id="end_date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter project description"
        />
      </div>
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/projects")}
          className="w-full md:w-auto"
        >
          Back
        </Button>
        <Button type="submit" className="w-full md:w-auto">
          Save Project
        </Button>
      </div>
    </form>
  </div>
  
  );
}
