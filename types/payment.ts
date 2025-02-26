import { Bill } from "./bill";
import Project from "./projects";

export interface Payment {
    id: number;
    bill_id: number;
    bill: Bill;
    proof: string;
    payment_amout: number;
  }
  