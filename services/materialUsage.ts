import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;


export const getMaterialUsage = async (projectId : any) => {
    const token = localStorage.getItem("token");
    if (!token) return;
  
    try {
      const response = await axios.get(`${API_URL}/project/${projectId}/material-usage`, {
        headers: {
          'Authorization': `Bearer ${token}`, 
        },
      });
  
      return response.data;
    } catch (error) {
      console.error('Error fetching material usage data:', error);
     
      return null;
    }
  };

  
  export const createMaterialUsage = async (idProject:any ,data: any) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.post(`${API_URL}/project/${idProject}/material-usage/`, data, {
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

export const editMaterialUsage = async (data: any, projectId : any, materialId : any) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.put(`${API_URL}/project/${projectId}/material-usage/${materialId}`, data, {
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


export const findMaterialUsage = async (projectId: string | number, materialId: string | number) => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      console.error("No token found. Please log in.");
      return null;
    }
  
    try {
      const response = await axios.get(`${API_URL}/project/${projectId}/material-usage/${materialId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      return response.data;
    } catch (error) {
      console.error('Error fetching material usage data:', error);
      return null;
    }
  };


  export const deleteMaterialUsage = async (projectId : any, materialId: any) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.delete(`${API_URL}/project/${projectId}/material-usage/${materialId}`, {
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