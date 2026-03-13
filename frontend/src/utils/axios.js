import axios from "axios";
import conf from "../conf/conf.js";

const axiosInstance = axios.create({
    baseURL: conf.backendURL,
    withCredentials: true,
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (originalRequest) {
            const skipUrls = ['/login', '/register', '/refresh-token'];
            const shouldSkip = skipUrls.some(url => originalRequest.url.includes(url));
            //If error is 401 and not processed yet
            if (error.response?.status === 401 && !shouldSkip && !originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    // sends httpOnly refresh token cookie
                    await axiosInstance.post('/users/refresh-token');
                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    const customErr = new Error(refreshError.response?.data?.message || refreshError.message);
                    customErr.status = refreshError.response?.status;
                    return Promise.reject(customErr);
                }
            }
        }

        // Sanitize error to prevent leaking backend URL in error config
        const customErr = new Error(error.response?.data?.message || error.message);
        customErr.status = error.response?.status;
        return Promise.reject(customErr);
    }
);

export default axiosInstance;
