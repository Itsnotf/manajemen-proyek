import { Material } from "./material";
import User from "./users";

export interface PurchaseOrder {
    id: number;
    material_id: number;
    material: Material;
    requested_by: User;
    approved_by?: number | null;
    quantity: number;
    vendor: string;
    unit_price: number;
    proof?: string | null;
    status: 'pending' | 'not approved' | 'approved' | 'completed';
  }
  