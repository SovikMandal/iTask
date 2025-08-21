import axios from "axios";
import { BASE_URL } from "./apiPaths.js";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request Interceptors
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
        if (error.response.status === 401) {
            window.location.href = "/login";
            console.error("Unauthorized access - redirecting to login");
        } 
        
        else if (error.response.status === 500) {
            console.error("Internal server error - please try again later");
        } 
        
        else if (error.code === "ECONNABORTED") {
            console.error("Request timed out - please try again later");
        }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
