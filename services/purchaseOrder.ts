import axios from "axios";


const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const addPurchaseOrder = async (data: any) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.post(`${API_URL}/purchaseOrder`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error(error);
        return [];
    }
}


export const getPurchaseOder = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
  
    try {
      const response = await axios.get(`${API_URL}/purchaseOrder`, {
        headers: {
          'Authorization': `Bearer ${token}`, 
        },
      });
  
      return response.data;
    } catch (error) {
      console.error('Error fetching material data:', error);
     
      return null;
    }
  };

  
export const approvePurchaseOder = async (id : any, approved_by : number) => {
    const token = localStorage.getItem("token");
    if (!token) return;
  
    try {
      const response = await axios.post(`${API_URL}/purchaseOrder/approved/${id}`, {approved_by: approved_by} ,{
        headers: {
          'Authorization': `Bearer ${token}`, 
        },
      });
  
      return response.data;
    } catch (error) {
      console.error('Error fetching material data:', error);
     
      return null;
    }
  };

  export const notApprovePurchaseOder = async (id: any, approved_by: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;
  
    try {
      const response = await axios.post(
        `${API_URL}/purchaseOrder/notapproved/${id}`,
        {approved_by: approved_by},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      return response.data;
    } catch (error) {
      console.error("Error fetching material data:", error);
      return null;
    }
  };

  export const completedPurchaseOrder = async (id: number | string, proof: File) => {
    const token = localStorage.getItem("token");
    if (!token) return null;
  
    try {
      const formData = new FormData();
      formData.append("proof", proof); 
  
      const response = await axios.post(
        `${API_URL}/purchaseOrder/completed/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      return response.data;
    } catch (error) {
      console.error("Error submitting proof:", error);
      return null;
    }
  };