import axios from "axios";
import conf from "../conf/conf.js";

const axiosInstance = axios.create({
    baseURL: conf.backendURL,
    withCredentials: true
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        //If error is 401 and not processed yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                // sends httpOnly refresh token cookie
                await axiosInstance.post('/users/refresh-token');
                return axiosInstance(originalRequest);
            } catch (error) {
                window.location.href = '/login';
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
)

export default axiosInstance;
