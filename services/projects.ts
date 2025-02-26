import Project from '@/types/projects';
import Task from '@/types/task';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getProjects = async () => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.get(`${API_URL}/project`, {
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

export const createProjects = async (data: FormData) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.post(`${API_URL}/project`, data, {
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

export const findProjects = async (id : any) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.get(`${API_URL}/project/${id}`, {
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

export const deleteProjects = async (id : any) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.delete(`${API_URL}/project/${id}`, {
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

export const editProjects = async (data: FormData, id: any) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.post(`${API_URL}/project/${id}`, data, {
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


export const findMilestone = async (idProject: any, idMilestone: any) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.get(`${API_URL}/project/${idProject}/milestones/${idMilestone}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        });

        if (response.status === 200) {
            console.log("Milestone Data:", response.data);
            return response.data.data; 
        }
        
        throw new Error(response.data.message);
    } catch (error) {
        console.error("Error fetching milestone:", error);
        return null;
    }
};

export const addMilestone = async (id : any, data: any) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.post(`${API_URL}/project/${id}/milestones`, data, {
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


export const createTask = async (data: any) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.post(`${API_URL}/tasks`, data, {
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

export const editTask = async (data: any, id : any) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.put(`${API_URL}/tasks/${id}`, data, {
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

export const deleteTask = async (id : any) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.delete(`${API_URL}/tasks/${id}`,{
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

export const takeTask = async (taskId : any, usersId : any) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.post(`${API_URL}/tasks/${taskId}/take`, { users_id: usersId },{
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

export const submitTask = async (taskId : any, result : any) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.post(`${API_URL}/tasks/${taskId}/submit-result`, { result: result },{
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

export const rejectTask = async (taskId : any, revision : any) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.post(`${API_URL}/tasks/${taskId}/reject`, { revision_note: revision },{
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

export const approveTask = async (taskId: any) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.post(
            `${API_URL}/tasks/${taskId}/approve`,
            {}, 
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error(error);
        return [];
    }
}



export const addStakeholders = async (id : any, data: any) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.post(`${API_URL}/project/${id}/stakeholders`, data, {
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

export const deleteStakeholders = async (projectId : any, stakeholderId: any) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.delete(`${API_URL}/project/${projectId}/stakeholders/${stakeholderId}`, {
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

