import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Task from "@/types/task";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MoreVertical, Plus } from "lucide-react";
import dayjs from "dayjs";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import ModalCreate from "./ModalCreate";
import ModalDetail from "./ModalDetail";
import { Badge } from "@/components/ui/badge";

interface KanbanProps {
  tasks: Task[];
  milestoneId: any;
}

const statuses = [
  "pending",
  "in-progress",
  "validation",
  "completed",
  "revision",
];

const borderColors: { [key: string]: string } = {
  pending: "border-b-2 border-blue-500",
  "in-progress": "border-b-2 border-yellow-500",
  validation: "border-b-2 border-purple-500",
  completed: "border-b-2 border-green-500",
  revision: "border-b-2 border-red-500",
};

export default function Kanban({ tasks, milestoneId }: KanbanProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [detail, setDetail] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const userString = localStorage.getItem("users") || "{}";
  const user = JSON.parse(userString);

  const getShadowColor = (endDate: string) => {
    const today = dayjs();
    const end = dayjs(endDate);
    const diffDays = end.diff(today, "day");

    if (diffDays > 7) return "shadow-gray-400";
    if (diffDays >= 4) return "shadow-yellow-400";
    if (diffDays >= 1) return "shadow-orange-400";
    return "shadow-red-500";
  };

  const handleOpenDetail = (task: Task) => {
    setSelectedTask(task);
    setDetail(true);
  };

  return (
    <Card className="p-4 my-4">
      <CardHeader className="flex flex-col md:flex-row items-center justify-between">
        <Label className="text-xl font-bold">Kanban Board</Label>
        {user.role_id === 1 || user.role_id === 3 ? (
          <Button
            variant="outline"
            className="flex items-center gap-2 rounded-full mt-2 md:mt-0"
            onClick={() => setIsOpen(true)}
          >
            <Plus size={16} />
            Add Task
          </Button>
        ) : null}

        <ModalCreate
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          milestoneId={milestoneId}
        />
        <ModalDetail
          selectedTask={selectedTask}
          setSelectedTask={setSelectedTask}
          detail={detail}
          setDetail={setDetail}
        />
      </CardHeader>

      {tasks.length === 0 ? (
        <div className="text-center text-gray-500 mt-4">Task tidak ada</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mt-4">
          {statuses.map((status) => (
            <div key={status}>
              <h3
                className={`text-lg font-semibold text-gray-700 capitalize text-center py-2 ${borderColors[status]}`}
              >
                {status}
              </h3>
              <div className="space-y-3 mt-3">
                {tasks
                  .filter((task) => task.status === status)
                  .map((task) => (
                    <Card
                      key={task.id}
                      className={`${getShadowColor(
                        task.end_date
                      )} cursor-pointer pt-2`}
                      onClick={() => handleOpenDetail(task)}
                    >
                      <CardContent className="my-2">
                        <h4 className="text-sm font-medium">{task.title}</h4>
                        <p className="text-xs text-gray-600 text-justify line-clamp-3">
                          {task.deskription}
                        </p>
                      </CardContent>
                      <CardFooter>
                        <div className="flex flex-col">
                          <div className="flex flex-col space-y-1 mt-2">
                            <Label>Timeline</Label>
                            <p className="text-xs text-gray-500">
                              {dayjs(task.start_date).format("DD/MM/YY")} -{" "}
                              {dayjs(task.end_date).format("DD/MM/YY")}
                            </p>
                          </div>
                          <div>
                            {task.status !== "pending" && (
                              <Label className="text-xs">
                                {task.stakeholder?.user?.name}
                              </Label>
                            )}
                          </div>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
