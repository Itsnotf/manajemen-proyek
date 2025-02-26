import Stakeholder from "./stakeholder";
import User from "./users";

export default interface Task {
    id: number;
    milestone_id: number;
    stakeholder_id: number | null;
    stakeholder: Stakeholder;
    title: string;
    deskription: string; 
    start_date: string;
    end_date: string;
    result: string | null;
    revision_note: string | null;
    status: "pending" | "in-progress" | "completed" | string; // tambahkan status lain jika perlu
    created_at: string;
    updated_at: string;
  }
  