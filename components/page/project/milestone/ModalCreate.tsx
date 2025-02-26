"use client"

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { createTask } from "@/services/projects";
import { Plus } from "lucide-react";
import React, { useState } from "react";

export default function ModalCreate({
  isOpen,
  setIsOpen,
  milestoneId
}: any) {
  const [newTask, setNewTask] = useState({
    milestone_id: milestoneId,
    title: "",
    deskription: "",
    start_date: "",
    end_date: "",
    status: "pending",
  });
  const [loading, setLoading] = useState(false);

  const userString = localStorage.getItem("users") || "{}";
  const user = JSON.parse(userString);

   const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      setNewTask({ ...newTask, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true)
      try {
        const response = await createTask(newTask);
        toast({
          title: "Success",
          description: response.message || "Project created successfully!",
          variant: "default",
        });
        setIsOpen(false);
      } catch (error) {
        console.error("Failed to create task:", error);
      }finally{
        setLoading(false)
        window.location.reload();
      }
    };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label>Title</Label>
            <Input
              name="title"
              type="text"
              placeholder="Enter task title"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              name="deskription"
              placeholder="Enter task description"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label>Start Date</Label>
            <Input
              name="start_date"
              type="date"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label>End Date</Label>
            <Input
              name="end_date"
              type="date"
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit">{loading ? "Submiting..." : "Submit" }</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
