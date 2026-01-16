import axios from "../utils/axios";

export class VideoService {

    async getAllVideos({ page, limit, query, sortBy, sortType }) {
        try {
            const response = await axios.get(`/videos`, { params: { page: page || 1, limit: limit || 10, query: query || "", sortBy: sortBy || "createdAt", sortType: sortType || "desc" } })
            return response.data
        } catch (error) {
            console.log("VideoService :: getAllVideos :: error", error)
            throw error
        }
    }

    async publishVideo({ title, description, isPublished = true, video, thumbnail }) {
        try {
            let formData = new FormData()
            formData.append("title", title)
            formData.append("description", description)
            formData.append("isPublished", isPublished)
            formData.append("video", video)
            formData.append("thumbnail", thumbnail)
            const response = await axios.post(`/videos/publish`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            return response.data;
        } catch (error) {
            console.log("VideoService :: publishVideo :: error", error)
            throw error
        }
    }

    async getVideoById({ videoId }) {
        try {
            const response = await axios.get(`/videos/${videoId}`)
            return response.data
        } catch (error) {
            console.log("VideoService :: getVideoById :: error", error)
            throw error
        }
    }

    async updateVideo({ videoId, title, description, isPublished = true, video, thumbnail }) {
        try {
            let formData = new FormData()
            formData.append("title", title)
            formData.append("description", description)
            formData.append("isPublished", isPublished)
            formData.append("video", video)
            formData.append("thumbnail", thumbnail)
            const response = await axios.patch(`/videos/update/${videoId}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            return response.data;
        } catch (error) {
            console.log("VideoService :: updateVideo :: error", error)
            throw error
        }
    }

    async deleteVideo({ videoId }) {
        try {
            const response = await axios.delete(`/videos/delete/${videoId}`)
            return response.data
        } catch (error) {
            console.log("VideoService :: deleteVideo :: error", error)
            throw error
        }
    }
}

const videoService = new VideoService();
export default videoService;
