import axios from "axios";
import conf from "../conf/conf.js";

const axiosInstance = axios.create({
    baseURL: conf.backendURL,
    withCredentials: true
});

export default axiosInstance;
