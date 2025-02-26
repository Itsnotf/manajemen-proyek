import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;


export const getBill = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
  
    try {
      const response = await axios.get(`${API_URL}/bill`, {
        headers: {
          'Authorization': `Bearer ${token}`, 
        },
      });
  
      return response.data;
    } catch (error) {
      console.error('Error fetching bill data:', error);
     
      return null;
    }
  };

export const findBill = async (id : any) => {
    const token = localStorage.getItem("token");
    if (!token) return;
  
    try {
      const response = await axios.get(`${API_URL}/bill/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`, 
        },
      });
  
      return response.data;
    } catch (error) {
      console.error('Error fetching bill data:', error);
     
      return null;
    }
  };