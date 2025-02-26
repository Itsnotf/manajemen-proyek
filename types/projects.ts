import User from "./users";

export default interface Project {
    id: number; 
    client_id: number; 
    title: string;
    description: string;
    service_price: string; 
    start_date: string;
    end_date: string;
    file: any;
    stakeholders: User[];
    amount?: number;
    status?: "pending" | "in-progress" | "completed";
    client: {
        id: number;
        role_id: number;
        email: string;
        name: string;
        created_at: string;
        updated_at: string;
    };
}
