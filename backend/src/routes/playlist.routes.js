import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addVideoToPlaylist, createPlaylist, deletePlaylist, getPlaylistById, getUserPlaylists, deleteVideoFromPlaylist, updatePlaylist } from "../controllers/playlist.controller.js";

const router = Router();

// Secure
router.route("/create").post(verifyJWT, createPlaylist);
router.route("/:playlistId").delete(verifyJWT, deletePlaylist);
router.route("/add/:playlistId").patch(verifyJWT, addVideoToPlaylist);
router.route("/delete/:playlistId").delete(verifyJWT, deleteVideoFromPlaylist);
router.route("/:playlistId").patch(verifyJWT, updatePlaylist);

router.route("/:userId").get(getUserPlaylists);
router.route("/:playlistId").get(getPlaylistById);

export default router;