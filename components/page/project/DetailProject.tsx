"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { deleteStakeholders, findProjects } from "@/services/projects";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Project from "@/types/projects";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Milestone } from "@/types/milestone";
import Link from "next/link";
import ModalCreateStake from "./ModalCreateStake";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import User from "@/types/users";
import ModalCreateMilestone from "./ModalCreateMilestone";
import { TableMaterialUsage } from "./materialUsage/TableMaterialUsage";
import { ColumnsMaterialUsage } from "./materialUsage/Columns";
import { getMaterialUsage } from "@/services/materialUsage";
import { MaterialUsage } from "@/types/materialUsage";

export default function DetailProjectPage() {
  const API_SAC = process.env.NEXT_PUBLIC_API_URL_WEB;
  const { projectsId } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = React.useState(0);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isOpenStake, setIsOpenStake] = useState(false);
  const [isOpenMilestone, setIsOpenMilestone] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [materialUsage, setMaterialUsage] = useState<MaterialUsage[]>([]);
  const [selectedStakeholder, setSelectedStakeholder] = useState<User | null>(
    null
  );
  const userString = localStorage.getItem("users") || "{}";
  const user = JSON.parse(userString);

  const handleDeleteStakeholder = async () => {
    if (!selectedStakeholder) return;

    try {
      await deleteStakeholders(projectsId, selectedStakeholder.id);
      setProject((prev) => ({
        ...prev!,
        stakeholders: prev!.stakeholders.filter(
          (s) => s.id !== selectedStakeholder.id
        ),
      }));
    } catch (error) {
      console.error("Failed to delete stakeholder:", error);
    } finally {
      setIsAlertOpen(false);
    }
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectData = await findProjects(projectsId);
        setProject(projectData.project);
        setProgress(projectData.progress);
        setMilestones(projectData.project.milestones);
      } catch (error) {
        console.error("Failed to fetch project:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [projectsId]);

  useEffect(() => {
    const fetchMaterialUsage = async () => {
      try {
        const materialUsageData = await getMaterialUsage(projectsId);
        setMaterialUsage(materialUsageData.data);
      } catch (error) {
        console.error("Failed to fetch project:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMaterialUsage();
  }, [projectsId]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!project) {
    return <div className="text-red-500">Project not found</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 my-4">
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Stakeholder?</AlertDialogTitle>
            <AlertDialogDescription>
              Anda yakin ingin menghapus{" "}
              <strong>{selectedStakeholder?.name}</strong>? Tindakan ini tidak
              dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsAlertOpen(false)}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 text-white"
              onClick={handleDeleteStakeholder}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ModalCreateMilestone
        isOpenMilestone={isOpenMilestone}
        setIsOpenMilestone={setIsOpenMilestone}
        projectId={projectsId}
      />

      <ModalCreateStake
        isOpenStake={isOpenStake}
        setIsOpenStake={setIsOpenStake}
        projectId={projectsId}
        stakeHolderId={project.stakeholders}
      />

      <div className="col-span-12">
        <TableMaterialUsage
          projectId={projectsId}
          columns={ColumnsMaterialUsage}
          data={materialUsage}
          user={user}
        />
      </div>

      <div className="col-span-12 md:col-span-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between p-2">
            <h2 className="text-lg font-bold">{`Project ${project.title}`}</h2>
            {project.file && (
              <Button
                variant="link"
                onClick={() =>
                  window.open(`${API_SAC}/storage/${project.file}`, "_blank")
                }
              >
                View File
              </Button>
            )}
          </CardHeader>

          <div className="p-4">
            <div className="mb-4 flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-xl">Stakeholder</Label>
                {user.role_id === 1 && (
                  <Button
                    onClick={() => setIsOpenStake(true)}
                    variant="outline"
                    className="rounded-full p-1 w-8 h-8"
                  >
                    <Plus />
                  </Button>
                )}
              </div>
              <div className="border p-2 rounded-md gap-2 flex flex-wrap">
                {project.stakeholders.map((stakeholder) => (
                  <Badge
                    className={`w-fit ${
                      user.role_id !== 1
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer"
                    }`}
                    key={stakeholder.id}
                    onClick={() => {
                      if (user.role_id === 1) {
                        setSelectedStakeholder(stakeholder);
                        setIsAlertOpen(true);
                      }
                    }}
                  >
                    {stakeholder.name}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="client_name">Client</Label>
                <Input
                  type="text"
                  value={project.client.name}
                  disabled
                  id="client_name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="service_price">Service Price</Label>
                <Input
                  type="text"
                  value={`${project.service_price}`}
                  disabled
                  id="service_price"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  type="text"
                  value={new Date(project.start_date).toLocaleDateString()}
                  disabled
                  id="start_date"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  type="text"
                  value={new Date(project.end_date).toLocaleDateString()}
                  disabled
                  id="end_date"
                  className="mt-1"
                />
              </div>
            </div>
            <div className="mb-4">
              <Label htmlFor="description">Description</Label>
              <Textarea
                value={project.description}
                disabled
                id="description"
                className="mt-1"
                rows={4}
              />
            </div>
            <Badge variant="outline">{project.status}</Badge>
          </div>
        </Card>
      </div>

      <div className="col-span-12 md:col-span-8">
        <Card>
          <CardHeader>
            <div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Project Progres</Label>
                  <Label>{progress}%</Label>
                </div>
                <Progress value={progress} className="" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-full">
            <div className="flex justify-between items-center">
              <Label className="text-3xl">Milestone</Label>
              {(user.role_id === 1 || user.role_id === 3) && (
                <Button
                  variant="outline"
                  onClick={() => setIsOpenMilestone(true)}
                  className="rounded-full"
                >
                  <Plus />
                  Add Milestone
                </Button>
              )}
            </div>
            <div className="my-5">
              {milestones && milestones.length > 0 ? (
                milestones.map((milestone, index) => (
                  <Link
                    href={`/projects/${project.id}/milestone/${milestone.id}`} // Use milestone.id if available
                    key={milestone.id || index} // Fallback to index if id is not available
                    className="border-b py-2 flex justify-between"
                  >
                    <Label className="text-base">{milestone.title}</Label>
                    <Badge variant="default">{milestone.status}</Badge>
                  </Link>
                ))
              ) : (
                <div className="flex items-center justify-center w-full h-[30vh]">
                  <Label className="">Milestone Not Yet</Label>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
