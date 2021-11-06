import express from "express";
import { requireSignIn, hasAuthorization } from "../controllers/authController";

import { userById } from "../controllers/userController";

import { listNewsFeed, listPostsByUser } from "../controllers/postController";

const router = express.Router();

router.route("/api/posts/feed/:userId").get(requireSignIn, listNewsFeed);
router.route("/api/posts/by/:userId").get(requireSignIn, listPostsByUser);

router.param("userId", userById);

export default router;
