import axios from "axios";

export const axiosInstance = axios.create({

    /****** Use import.meta.env.MODE instead of process.env.NODE_ENV because this is the frontend code ******/
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api",
    withCredentials: true,
});