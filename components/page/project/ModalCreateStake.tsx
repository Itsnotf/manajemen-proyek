"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { addStakeholders } from "@/services/projects";
import { getUsers } from "@/services/users";
import User from "@/types/users";
import Select from "react-select";

export default function ModalCreateStake({
  isOpenStake,
  setIsOpenStake,
  projectId,
  stakeHolderId,
}: any) {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[] | null>([]);
  const [stakeHolder, setStakeHolder] = useState<number[]>(
    Array.isArray(stakeHolderId) ? stakeHolderId : []
  );
  const [error, setError] = useState("");
  const [selectedStakeholders, setSelectedStakeholders] = useState<any>([]);

  const existingStakeholderIds = stakeHolderId.map(
    (stakeholder: any) => stakeholder.id
  );

  const stakeholderOptions = users
    ?.filter((user: any) => user.role_id === 3) // Hanya user dengan role_id 3
    .filter((user: any) => !existingStakeholderIds.includes(user.id)) // Hanya user yang belum menjadi stakeholder
    .map((user) => ({
      value: user.id.toString(),
      label: user.name,
    }));
  // Mengambil data users
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

  const handleStakeholderChange = (selectedOptions: any) => {
    setSelectedStakeholders(selectedOptions);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const stakeholderIds = selectedStakeholders.map(
      (option: any) => option.value
    );

    setIsLoading(true);
    try {
      const response = await addStakeholders(projectId, {
        user_id: stakeholderIds,
      });
      toast({
        title: "Stake Holders add successfully",
        description: response.message,
      });
      setIsOpenStake(false);
    } catch (error: any) {
      console.error("Error creating stakeholders", error);
      toast({
        title: "Error",
        description: "Failed to create stakeholders",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpenStake} onOpenChange={setIsOpenStake}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label>Stakeholders</Label>
            <Select
              isMulti
              options={stakeholderOptions}
              value={selectedStakeholders}
              onChange={handleStakeholderChange}
              placeholder="Select stakeholders"
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
