"use client";
import React, { useEffect, useState } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Milestone } from "@/types/milestone";
import { findMilestone } from "@/services/projects"; // Pastikan path dan nama file sesuai
import Task from "@/types/task";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import Kanban from "./Kanban";

export default function MilestoneDetail() {
  const router = useRouter();
  

  const { projectsId, milestoneId } = useParams() as {
    projectsId: string;
    milestoneId: string;
  };

  const [milestone, setMilestone] = useState<Milestone | null>(null);
  const [progress, setProgress] = useState(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMilestone = async () => {
      try {
        const data = await findMilestone(projectsId, milestoneId);

        if (!data || data.status === 404) {
          router.push("/404"); 
          return;
        }

        setMilestone(data.data);
        setTasks(data.data.tasks);
        setProgress(data.progress);
      } catch (error) {
        console.error("Failed to fetch milestone:", error);
        router.push("/404");
      } finally {
        setIsLoading(false);
      }
    };

    if (projectsId && milestoneId) {
      fetchMilestone();
    }
  }, [projectsId, milestoneId, router]);

  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label className="text-sm font-medium text-gray-600">
                Milestone Progress
              </Label>
              <Label className="text-sm font-medium text-gray-600">
                {progress}%
              </Label>
            </div>
            <Progress value={progress} className="h-2 rounded" />
          </div>
        </CardHeader>
        <CardContent className="flex flex-col space-y-2">
          <h3 className="text-2xl font-bold text-gray-900">
            {milestone?.title}
          </h3>
          <p className="text-base text-gray-700">{milestone?.deskription}</p>
        </CardContent>
      </Card>
      <Kanban tasks={tasks} milestoneId={milestone?.id} />
    </div>
  );
}
