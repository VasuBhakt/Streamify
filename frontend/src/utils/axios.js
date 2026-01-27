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
        const skipUrls = ['/login', '/register', '/refresh-token'];
        const shouldSkip = skipUrls.some(url => originalRequest.url.includes(url));
        //If error is 401 and not processed yet
        if (error.response?.status === 401 && !shouldSkip && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                // sends httpOnly refresh token cookie
                await axiosInstance.post('/users/refresh-token');
                return axiosInstance(originalRequest);
            } catch (error) {
                // DON'T reload! Just reject. The component UI will handle the logout state.
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
)

export default axiosInstance;
