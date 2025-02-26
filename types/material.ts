import { MaterialUsage } from "./materialUsage";

export interface Material {
    id: number;
    title: string;
    description: string;
    sell_price: number;
    purchase_price: number; 
    quantity: number;
    usages : MaterialUsage[]
  }
  