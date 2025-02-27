"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useToast } from "@/hooks/use-toast";
import { Register } from "@/services/auth";
import { findUsers, updateUsers } from "@/services/users";
import LoadingSpinner from "@/components/LoadingSpinner";
import User from "@/types/users";
import EditUsers from "@/app/(dashboard)/users/edit/[id]/page";

const Select = dynamic(() => import("react-select"), { ssr: false });

const roleOptions = [
  { value: "1", label: "Admin" },
  { value: "2", label: "Finance" },
  { value: "3", label: "Engineer" },
  { value: "4", label: "Client" },
];

export default function FormEditUsers() {
  const { id } = useParams();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<{ value: string; label: string } | null>(
    null
  );
  const [data, setData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const users = await findUsers(id);
        setData(users);
      } catch (error) {
        console.error("Failed to fetch project:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (data) {
      setName(data.name);
      setEmail(data.email);
      setRole(roleOptions.find(option => option.value === String(data.role.id)) || null);
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const requiredFields = [
      { value: name, message: "Please enter a name." },
      { value: email, message: "Please enter an email." },
      { value: role?.value, message: "Please select a role." },
    ];

    for (const { value, message } of requiredFields) {
      if (!value) {
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
        return;
      }
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password || "");
      formData.append("role_id", role?.value || "");

      const response = await updateUsers(id, formData);
      toast({
        title: "Success",
        description: response.message || "User updated successfully!",
        variant: "default",
      });

      router.push("/users");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Failed to update user. Please try again.",
        variant: "destructive",
      });
    }
  };

  return isLoading ? (
    <LoadingSpinner />
  ) : (
    <div className="max-w-2xl mx-auto p-4">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="role">Role</Label>
            <Select
              options={roleOptions}
              value={
                roleOptions.find(
                  (option) => option.value === String(data?.role.id)
                ) || null
              }
              onChange={(selectedOption) => {
                setRole(selectedOption as { value: string; label: string });
              }}
              placeholder="Select a role"
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter full name"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter user email"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/users")}
          >
            Back
          </Button>
          <Button type="submit">Update User</Button>
        </div>
      </form>
    </div>
  );
}
