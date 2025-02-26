import { Material } from "./material";
import Project from "./projects";

export interface MaterialUsage {
    id: number;
    material_id: string;
    project_id: string;
    material: Material;
    project: Project;
    status: string; 
    quantity: number;
  }
  