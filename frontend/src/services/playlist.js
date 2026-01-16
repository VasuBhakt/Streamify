export class PlaylistService {

    async createPlaylist({ name, description, videos }) {
        try {
            const response = await axios.post(`/playlists/create`, { name, description, videos });
            return response.data;
        } catch (error) {
            console.log("PlaylistService :: createPlaylist :: error", error);
            throw error;
        }
    }

    async getUserPlaylists({ userId, page, limit }) {
        try {
            const response = await axios.get(`/playlists/${userId}`, { params: { page: page || 1, limit: limit || 10 } });
            return response.data;
        } catch (error) {
            console.log("PlaylistService :: getUserPlaylists :: error", error);
            throw error;
        }
    }

    async getPlaylistById({ playlistId }) {
        try {
            const response = await axios.get(`/playlists/${playlistId}`);
            return response.data;
        } catch (error) {
            console.log("PlaylistService :: getPlaylistById :: error", error);
            throw error;
        }
    }

    async deletePlaylist({ playlistId }) {
        try {
            const response = await axios.delete(`/playlists/${playlistId}`);
            return response.data;
        } catch (error) {
            console.log("PlaylistService :: deletePlaylist :: error", error);
            throw error;
        }
    }

    async addVideoToPlaylist({ playlistId, videoId, position }) {
        try {
            const response = await axios.patch(`/playlists/add/${playlistId}`, { videoId, position });
            return response.data;
        } catch (error) {
            console.log("PlaylistService :: addVideoToPlaylist :: error", error);
            throw error;
        }
    }

    async deleteVideoFromPlaylist({ playlistId, videoId }) {
        try {
            const response = await axios.delete(`/playlists/delete/${playlistId}`, { videoId });
            return response.data;
        } catch (error) {
            console.log("PlaylistService :: deleteVideoFromPlaylist :: error", error);
            throw error;
        }
    }

    async updatePlaylist({ playlistId, name, description }) {
        try {
            const response = await axios.patch(`/playlists/${playlistId}`, { name, description });
            return response.data;
        } catch (error) {
            console.log("PlaylistService :: updatePlaylist :: error", error);
            throw error;
        }
    }

}

const playlistService = new PlaylistService();
export default playlistService;