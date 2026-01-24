import axios from "../utils/axios";

export class CommentService {
    async getVideoComments({ videoId, page = 1, limit = 10 }) {
        try {
            const response = await axios.get(`/comments/${videoId}`, {
                params: { page, limit }
            });
            return response.data;
        } catch (error) {
            console.error("CommentService :: getVideoComments :: error", error);
            throw error;
        }
    }

    async addComment({ videoId, content }) {
        try {
            const response = await axios.post(`/comments/${videoId}`, { content });
            return response.data;
        } catch (error) {
            console.error("CommentService :: addComment :: error", error);
            throw error;
        }
    }

    async updateComment({ videoId, commentId, content }) {
        try {
            const response = await axios.patch(`/comments/${videoId}/${commentId}`, { content });
            return response.data;
        } catch (error) {
            console.error("CommentService :: updateComment :: error", error);
            throw error;
        }
    }

    async deleteComment({ videoId, commentId }) {
        try {
            const response = await axios.delete(`/comments/${videoId}/${commentId}`);
            return response.data;
        } catch (error) {
            console.error("CommentService :: deleteComment :: error", error);
            throw error;
        }
    }
}

const commentService = new CommentService();
export default commentService;
