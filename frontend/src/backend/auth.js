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


}

const authService = new AuthService();

export default authService;