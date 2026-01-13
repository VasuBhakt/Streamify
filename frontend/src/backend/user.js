import axios from "axios";

export class UserService {

    async changeUserPassword({ oldPassword, newPassword }) {
        try {
            const response = await axios.post("/users/change-password", { oldPassword: oldPassword, newPassword: newPassword });
            return response.data;
        } catch (error) {
            console.log("UserService :: changeUserPassword :: error", error);
            throw error;
        }
    }

    async updateUserAccountDetails({ fullName, email }) {
        try {
            const response = await axios.patch("/users/update-details", { fullName: fullName, email: email });
            return response.data;
        } catch (error) {
            console.log("UserService :: updateUserAccountDetails :: error", error);
            throw error;
        }
    }

    async updateUserAvatar({ avatar }) {
        try {
            let formData = new FormData();
            formData.append("avatar", avatar);
            const response = await axios.patch("/users/avatar", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            return response.data
        } catch (error) {
            console.log("UserService :: updateUserAvatar :: error", error);
            throw error;
        }
    }

    async updateUserCoverImage({ coverImage }) {
        try {
            let formData = new FormData();
            formData.append("coverImage", coverImage);
            const response = await axios.patch("/users/cover-image", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            return response.data
        } catch (error) {
            console.log("UserService :: updateUserCoverImage :: error", error);
            throw error;
        }
    }

    async getUserChannelProfile({ username }) {
        try {
            const response = await axios.get(`users/c/${username}`);
            return response.data;
        } catch (error) {
            console.log("UserService :: getUserChannelProfile :: error", error);
            throw error;
        }
    }

    async getUserWatchHistory({ page = 1, limit = 1 }) {
        try {
            const response = await axios.get(`users/history?page=${page}&limit=${limit}`);
            return response.data
        } catch (error) {
            console.log("UserService :: getUserWatchHistory :: error", error);
            throw error;
        }
    }

    async getUserChannelStats() {
        try {
            const response = await axios.get(`/dashboard`);
            return response.data;
        } catch (error) {
            console.log("UserService :: getUserChannelStats :: error", error);
            throw error
        }
    }

    async getUserAllVideos({ page = 1, limit = 10 }) {
        try {
            const response = await axios.get(`/dashboard/videos?page=${page}&limit=${limit}`);
            return response.data;
        } catch (error) {
            console.log("UserService :: getUserAllVideos :: error", error);
            throw error
        }
    }

}