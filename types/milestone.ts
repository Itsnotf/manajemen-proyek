import Task from "./task";

export interface Milestone {
    id: number;
    project_id: number;
    title: string;
    deskription: string;
    status: string;
    start_date: string; 
    end_date: string;
    created_at: string;
    updated_at: string;
    tasks: Task[];
  }
  