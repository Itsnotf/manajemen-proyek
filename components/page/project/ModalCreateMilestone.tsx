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
import { toast } from "@/hooks/use-toast";
import { addMilestone } from "@/services/projects";
import { Input } from "@/components/ui/input";

export default function ModalCreateMilestone({
  isOpenMilestone,
  setIsOpenMilestone,
  projectId,
}: any) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = {
      title,
      project_id: projectId,
      deskription: description,
      start_date: startDate,
      end_date: endDate,
    };

    setIsLoading(true);
    try {
      const response = await addMilestone(projectId, data);
      toast({
        title: "Milestone added successfully",
        description: response.message,
      });
      setIsOpenMilestone(false);
    } catch (error: any) {
      console.error("Error creating milestone", error);
      toast({
        title: "Error",
        description: "Failed to create milestone",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      window.location.reload()
    }
  };

  return (
    <Dialog open={isOpenMilestone} onOpenChange={setIsOpenMilestone}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Milestone</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label>Title</Label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter milestone title"
              required
            />
          </div>
          <div>
            <Label>Description</Label>
            <Input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter milestone description"
              required
            />
          </div>
          <div>
            <Label>Start Date</Label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div>
            <Label>End Date</Label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
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
