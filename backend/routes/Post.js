const express = require("express");
const isAuthenticated = require("../middlewares/isAuthenticated");
const { addNewPost, getAllPosts, getUserPost, likePost, dislikePost, addComment, getCommentOfPost, deletePost, bookmarkPost } = require("../controllers/Post");
const router = express.Router();

router.post("/addPost",isAuthenticated,addNewPost);
router.get("/all",isAuthenticated,getAllPosts);
router.get("/userpost/all",isAuthenticated,getUserPost);
router.get("/:id/like",isAuthenticated,likePost);
router.get("/:id/dislike",isAuthenticated,dislikePost);
router.post("/:id/comment",isAuthenticated,addComment);
router.post("/:id/comment/all",isAuthenticated,getCommentOfPost);
router.delete("/delete/:id",isAuthenticated,deletePost);
router.get("/:id/bookmark",isAuthenticated,bookmarkPost);

module.exports = router;

