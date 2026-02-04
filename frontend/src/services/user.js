import axios from "../utils/axios.js";

export class UserService {

    async changeUserPassword({ oldPassword, newPassword }) {
        try {
            const response = await axios.post("/users/change-password", { oldPassword, newPassword });
            return response.data;
        } catch (error) {
            console.log("UserService :: changeUserPassword :: error", error);
            throw error;
        }
    }

    async updateUserAccountDetails({ fullName, email }) {
        try {
            const response = await axios.patch("/users/update-details", { fullName, email });
            return response.data;
        } catch (error) {
            console.log("UserService :: updateUserAccountDetails :: error", error);
            throw error;
        }
    }

    async updateUserAvatar(avatar) {
        try {
            let formData = new FormData();
            formData.append("avatar", avatar);
            const response = await axios.patch("/users/avatar", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            return response.data;
        } catch (error) {
            console.log("UserService :: updateUserAvatar :: error", error);
            throw error;
        }
    }

    async updateUserCoverImage(coverImage) {
        try {
            let formData = new FormData();
            formData.append("coverImage", coverImage);
            const response = await axios.patch("/users/cover-image", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            return response.data;
        } catch (error) {
            console.log("UserService :: updateUserCoverImage :: error", error);
            throw error;
        }
    }

    async getUserChannelProfile(username) {
        try {
            const response = await axios.get(`/users/c/${username}`);
            return response.data;
        } catch (error) {
            console.log("UserService :: getUserChannelProfile :: error", error);
            throw error;
        }
    }

    async getUserWatchHistory({ page = 1, limit = 10 }) {
        try {
            const response = await axios.get(`/users/history`, { params: { page: page || 1, limit: limit || 10 } });
            return response.data;
        } catch (error) {
            console.log("UserService :: getUserWatchHistory :: error", error);
            throw error;
        }
    }

    async getUserChannelStats() {
        try {
            const response = await axios.get(`/dashboard/stats`);
            return response.data;
        } catch (error) {
            console.log("UserService :: getUserChannelStats :: error", error);
            throw error;
        }
    }

    async getUserAllVideos({ username, page = 1, limit = 10 }) {
        try {
            const response = await axios.get(`/dashboard/v/${username}`, { params: { page: page || 1, limit: limit || 10 } });
            return response.data;
        } catch (error) {
            console.log("UserService :: getUserAllVideos :: error", error);
            throw error;
        }
    }

    async getLikedVideos({ page = 1, limit = 10 }) {
        try {
            const response = await axios.get(`/likes/liked-videos`, { params: { page: page || 1, limit: limit || 10 } });
            return response.data;
        } catch (error) {
            console.log("UserService :: getLikedVideos :: error", error);
            throw error;
        }
    }

}

const userService = new UserService();
export default userService;