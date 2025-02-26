import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;


export const getPayment = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
  
    try {
      const response = await axios.get(`${API_URL}/payments`, {
        headers: {
          'Authorization': `Bearer ${token}`, 
        },
      });
  
      return response.data;
    } catch (error) {
      console.error('Error fetching payments data:', error);
     
      return null;
    }
  };

export const findPayment = async (idBill : any) => {
    const token = localStorage.getItem("token");
    if (!token) return;
  
    try {
      const response = await axios.get(`${API_URL}/payments/${idBill}`, {
        headers: {
          'Authorization': `Bearer ${token}`, 
        },
      });
  
      return response.data;
    } catch (error) {
      console.error('Error fetching payments data:', error);
      return null;
    }
  };


  
export const createPayment = async (data: FormData) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.post(`${API_URL}/payments`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
                "Accept": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error(error);
        return [];
    }
}
