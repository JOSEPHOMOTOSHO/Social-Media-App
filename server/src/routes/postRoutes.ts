import express from "express";
import { requireSignIn, hasAuthorization } from "../controllers/authController";

import { userById } from "../controllers/userController";

import {
  listNewsFeed,
  listPostsByUser,
  createPost,
  getPhoto,
  postById,
  isPoster,
  remove,
  like,
  unlike,
  comment,
  uncomment,
} from "../controllers/postController";

const router = express.Router();

router.route("/api/posts/new/:userId").post(requireSignIn, createPost);
router.route("/api/posts/photo/:postId").get(getPhoto);
router.route("/api/posts/by/:userId").get(requireSignIn, listPostsByUser);
router.route("/api/posts/feed/:userId").get(requireSignIn, listNewsFeed);

router.route("/api/posts/like").put(requireSignIn, like);
router.route("/api/posts/unlike").put(requireSignIn, unlike);

router.route("/api/posts/comment").post(requireSignIn, comment);
router.route("/api/posts/uncomment").post(requireSignIn, uncomment);

router.route("/api/posts/:postId").delete(requireSignIn, isPoster, remove);

router.param("userId", userById);
router.param("postId", postById);


export default router;
