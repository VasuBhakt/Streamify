export class LikeService {

    async toggleLikeVideo({ videoId }) {
        try {
            const response = await axios.post(`/likes/${videoId}`);
            return response.data;
        } catch (error) {
            console.log("LikeService :: toggleLikeVideo :: error", error);
            throw error;
        }
    }

    async toggleLikeComment({ commentId }) {
        try {
            const response = await axios.post(`/likes/${commentId}`);
            return response.data;
        } catch (error) {
            console.log("LikeService :: toggleLikeComment :: error", error);
            throw error;
        }
    }

    async userLikedVideos({ page = 1, limit = 10 }) {
        try {
            const response = await axios.get(`/likes/liked-videos`, { params: { page: page || 1, limit: limit || 10 } });
            return response.data;
        } catch (error) {
            console.log("LikeService :: userLikedVideos :: error", error);
            throw error;
        }
    }
}

const likeService = new LikeService();
export default likeService;