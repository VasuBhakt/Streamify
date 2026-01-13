import axios from "../utils/axios.js";

export class AuthService {

    async registerUser({ fullName, email, username, password, avatar, coverImage }) {
        try {
            // use formData to upload files
            const formData = new FormData();
            formData.append("fullName", fullName);
            formData.append("email", email);
            formData.append("username", username);
            formData.append("password", password);
            formData.append("avatar", avatar);

            if (coverImage) {
                formData.append("coverImage", coverImage);
            }

            const response = await axios.post("/users/register", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });
            return response.data; // axios returns response in data field
        } catch (error) {
            console.error("AuthService :: registerUser :: error", error);
            throw error;
        }
    }

    async loginUser({ email, username, password }) {
        try {
            const response = await axios.post("/users/login", { email, username, password });
            return response.data;
        } catch (error) {
            console.error("AuthService :: loginUser :: error", error);
            throw error;
        }
    }

    async logoutUser() {
        try {
            const response = await axios.post("/users/logout");
            return response.data;
        } catch (error) {
            console.log("AuthService :: logoutUser :: error", error);
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            const response = await axios.get("/users/current-user");
            return response.data;
        } catch (error) {
            console.log("AuthService :: getCurrentuser :: error", error);
            throw error;
        }
    }

    async refreshAccessToken() {
        try {
            const response = await axios.post("/users/refresh-token");
            return response.data;
        } catch (error) {
            console.log("AuthService :: refreshAccessToken :: error", error);
            throw error;
        }
    }
}

const authService = new AuthService();

export default authService;