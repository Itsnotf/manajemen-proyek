import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;


export const getMaterial = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
  
    try {
      const response = await axios.get(`${API_URL}/material`, {
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

export const createMaterial = async (data: any) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.post(`${API_URL}/material`, data, {
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

export const editMaterial = async (data: any, id : any) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.put(`${API_URL}/material/${id}`, data, {
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

export const findMaterial = async (id : any) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.get(`${API_URL}/material/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        });        
        return response.data.data; 
    } catch (error) {
        console.error(error);
        return [];
    }
}


export const deleteMaterial = async (id : any) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.delete(`${API_URL}/material/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });        
        return response.data; 
    } catch (error) {
        console.error(error);
        return [];
    }
}

