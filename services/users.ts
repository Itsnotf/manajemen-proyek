import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;


export const getUsers = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
  
    try {
      const response = await axios.get(`${API_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${token}`, 
        },
      });
  
      return response.data.users;
    } catch (error) {
      console.error('Error fetching user data:', error);
     
      return null;
    }
  };
  
export const findUsers = async (id : any) => {
    const token = localStorage.getItem("token");
    if (!token) return;
  
    try {
      const response = await axios.get(`${API_URL}/users/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`, 
        },
      });
  
      return response.data.user;
    } catch (error) {
      console.error('Error fetching user data:', error);
     
      return null;
    }
  };

export const updateUsers = async (id : any, data : any) => {
    const token = localStorage.getItem("token");
    if (!token) return;
  
    try {
      const response = await axios.post(`${API_URL}/users/${id}`,data,{
        headers: {
          'Authorization': `Bearer ${token}`, 
        },
      });
  
      return response.data;
    } catch (error) {
      console.error('Error fetching user data:', error);
     
      return null;
    }
  };

export const deleteUsers = async (id : any) => {
    const token = localStorage.getItem("token");
    if (!token) return;
  
    try {
      const response = await axios.delete(`${API_URL}/users/${id}`,{
        headers: {
          'Authorization': `Bearer ${token}`, 
        },
      });
  
      return response.data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };



  