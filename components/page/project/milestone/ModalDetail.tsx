"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Plus, Trash } from "lucide-react";
import { useState } from "react";
import Task from "@/types/task";
import dayjs from "dayjs";
import {
  approveTask,
  deleteTask,
  editTask,
  rejectTask,
  submitTask,
  takeTask,
} from "@/services/projects";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function ModalDetail({
  selectedTask,
  setSelectedTask,
  detail,
  setDetail,
}: any) {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const userString = localStorage.getItem("users") || "{}";
  const user = JSON.parse(userString);
  const router = useRouter();

  const handleEdit = () => setIsEditing(true);
  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleChangeEdit = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!selectedTask) return;

    setSelectedTask((prevTask: any) => ({
      ...prevTask!,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTask?.id) return;

    try {
      const updatedTask = await editTask(selectedTask, selectedTask.id);
      setSelectedTask(updatedTask);
    } catch (error) {
      console.error("Error updating task:", error);
    } finally {
      setIsEditing(false);
      window.location.reload();
    }
  };

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTask?.id) return;

    try {
      const res = await deleteTask(selectedTask.id);
      toast({
        title: "Success",
        description: res.message || "Project created successfully!",
        variant: "default",
      });
    } catch (error) {
      console.error("Error updating task:", error);
    } finally {
      setIsEditing(false);
      window.location.reload();
    }
  };

  const handleApprove = async (e: React.FormEvent) => {
    e.preventDefault();
    // const user = JSON.parse(localStorage.getItem("users") || "{}");
    // const userId = user?.id ? String(user.id) : null;

    // if (!userId) {
    //   console.error("User ID not found in localStorage");
    //   return;
    // }
    try {
      const res = await approveTask(selectedTask.id);

      toast({
        title: "Success",
        description: res.message || "Task successfully approve!",
        variant: "default",
      });

      window.location.reload();
      setSelectedTask(null);
    } catch (error) {
      console.error("Error updating task:", error);
    } finally {
      setIsEditing(false);
    }
  };

  const handleTake = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("users") || "{}");
    const userId = user?.id ? String(user.id) : null;

    if (
      selectedTask?.stakeholder?.user_id &&
      userId !== selectedTask.stakeholder.user_id
    ) {
      toast({
        title: "Error",
        description: "You can't take this Task!",
        variant: "default",
      });
      return;
    }

    if (!selectedTask?.id) return;

    try {
      const res = await takeTask(selectedTask.id, userId);

      toast({
        title: "Success",
        description: res.message || "Task successfully taken!",
        variant: "default",
      });

      window.location.reload();
      setSelectedTask(null);
    } catch (error) {
      console.error("Error updating task:", error);
    } finally {
      setIsEditing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("users") || "{}");
    const userId = user?.id ? user.id : null;

    if (userId !== selectedTask.stakeholder.user_id) {
      toast({
        title: "Success",
        description: "You can't submit this Task!",
        variant: "default",
      });
      return;
    }

    try {
      const res = await submitTask(selectedTask.id, selectedTask.result);

      toast({
        title: "Success",
        description: res.message || "Task successfully taken!",
        variant: "default",
      });

      window.location.reload();
      setSelectedTask(null);
    } catch (error) {
      console.error("Error updating task:", error);
    } finally {
      setIsEditing(false);
    }
  };

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();

    // const user = JSON.parse(localStorage.getItem("users") || "{}");
    // const userId = user?.id ? user.id : null;

    // if (userId !== selectedTask.stakeholder.user_id) {
    //   toast({
    //     title: "Success",
    //     description: "You can't submit this Task!",
    //     variant: "default",
    //   });
    //   return;
    // }
    if (!selectedTask.revision_note) {
      toast({
        title: "Success",
        description: "Revision note is still empty!",
        variant: "destructive",
      });
    }

    try {
      const res = await rejectTask(selectedTask.id, selectedTask.revision_note);

      toast({
        title: "Success",
        description: res.message || "Task successfully taken!",
        variant: "default",
      });

      window.location.reload();
      setSelectedTask(null);
    } catch (error) {
      console.error("Error updating task:", error);
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <Dialog open={detail} onOpenChange={setDetail}>
      <DialogContent>
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle>Task Detail</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmitEdit}>
          <div>
            <Label>Title</Label>
            <Input
              name="title"
              type="text"
              placeholder="Enter task title"
              value={selectedTask?.title || ""}
              onChange={handleChangeEdit}
              required
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              className="h-fit"
              name="deskription"
              placeholder="Enter task description"
              value={selectedTask?.deskription || ""}
              onChange={handleChangeEdit}
              required
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label>Start Date</Label>
            <Input
              name="start_date"
              type="date"
              value={dayjs(selectedTask?.start_date || "").format("YYYY-MM-DD")}
              onChange={handleChangeEdit}
              required
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label>End Date</Label>
            <Input
              name="end_date"
              type="date"
              value={dayjs(selectedTask?.end_date || "").format("YYYY-MM-DD")}
              onChange={handleChangeEdit}
              required
              disabled={!isEditing}
            />
          </div>
          {selectedTask &&
            ["in-progress", "validation", "completed", "revision"].includes(
              selectedTask.status
            ) && (
              <div>
                <Label className="flex flex-row justify-between items-center">
                  Result (Google Drive Link)
                  {selectedTask.result && (
                    <Button
                      variant="link"
                      className="ml-2"
                      onClick={() => window.open(selectedTask.result, "_blank")}
                    >
                      View result
                    </Button>
                  )}
                </Label>
                <Input
                  name="result"
                  type="url"
                  placeholder="Enter Google Drive link"
                  value={selectedTask?.result || ""}
                  onChange={handleChangeEdit}
                  disabled={
                    selectedTask.status !== "in-progress" ||
                    (user.id !== selectedTask.stakeholder.user_id && !isEditing)
                  }
                />
              </div>
            )}
          {(selectedTask && selectedTask?.status === "validation") ||
            (selectedTask?.status === "revision" && (
              <div>
                <Label>Revision Note</Label>
                <Textarea
                  name="revision_note"
                  placeholder="Enter revision note"
                  value={selectedTask?.revision_note || ""}
                  onChange={handleChangeEdit}
                  disabled={selectedTask.status === "revision" && !isEditing}
                />
              </div>
            ))}

          <DialogFooter className="flex justify-between">
            {!isEditing ? (
              <div className="flex flex-row justify-between w-full">
                {selectedTask &&  user.role_id === 3 && 
                  ["pending", "revision"].includes(selectedTask.status) && (
                    <div>
                      <Button onClick={handleTake}>Take</Button>
                    </div>
                  )}

                {selectedTask &&
                  selectedTask.status === "validation" &&
                  user.role_id === "1" && (
                    <div className="flex gap-2">
                      <Button onClick={handleApprove}>Approve</Button>
                      <Button onClick={handleReject}>Reject</Button>
                    </div>
                  )}
                {selectedTask &&
                  selectedTask.status === "in-progress" &&
                  user.id === selectedTask.stakeholder.user_id && (
                    <Button onClick={handleSubmit}>Submit</Button>
                  )}
                {selectedTask &&
                  selectedTask.status !== "complated" &&
                  user?.role_id === 1 && (
                    <div>
                      <Button variant="ghost" size="icon" onClick={handleEdit}>
                        <Pencil className="w-5 h-5 text-blue-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleDelete}
                      >
                        <Trash className="w-5 h-5 text-red-500" />
                      </Button>
                    </div>
                  )}
              </div>
            ) : (
              <div className="flex gap-2">
                <Button type="submit">Submit</Button>
                <Button variant="outline" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              </div>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
