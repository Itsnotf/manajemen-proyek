import axios from 'axios';
import { LoginResponse } from '@/types/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_SAC = process.env.NEXT_PUBLIC_API_URL_WEB;

axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = 'XSRF-TOKEN';
axios.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';

export const Login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const token = localStorage.getItem("token");
    await axios.get(`${API_SAC}/sanctum/csrf-cookie`, { withCredentials: true });

    const response = await axios.post(
      `${API_URL}/loginUser`,
      { email, password },
      {
        headers: {
           Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        withCredentials: true, 
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Login gagal");
    } else {
      throw new Error("Terjadi kesalahan yang tidak diketahui");
    }
  }
};

export const getUser = async () => {
  const token = localStorage.getItem("token");

  if (!token) return;

  try {
    const response = await axios.get(`${API_URL}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      withCredentials: true, 
    });

    return response.data.user;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};



export const Logout = async () => {
  const token = localStorage.getItem("token");

  if (!token) return;

  try {
    await axios.post(
      `${API_URL}/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        withCredentials: true, 
      }
    );

    localStorage.removeItem("token");
    document.cookie = "laravel_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    console.log("Logout berhasil");

    window.location.href = "/login";
  } catch (error) {
    console.error("Logout error:", error);
  }
};

export const user = async () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const response = await axios.get(`${API_URL}/user`, {
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

export const Register = async (data: FormData) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.post(
      `${API_URL}/registerUser`, 
      data, // ✅ Langsung kirim FormData, tidak dalam objek { data }
      {
        headers: {
          'Authorization': `Bearer ${token}`, 
          "Accept": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Register Gagal");
    } else {
      throw new Error("Terjadi kesalahan yang tidak diketahui");
    }
  }
};