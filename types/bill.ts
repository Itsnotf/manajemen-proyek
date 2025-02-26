import Project from "./projects";

export interface Bill {
    id: number;
    project_id: number;
    project: Project;
    total_amount: number;
    status:'pending' | 'paid off';
  }
  