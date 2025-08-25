import axios from "axios";

const API = axios.create({
    baseURL: "https://backend-ze6o.onrender.com/api", // backend server
});

// attach token
API.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;
