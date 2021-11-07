"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const userController_1 = require("../controllers/userController");
const postController_1 = require("../controllers/postController");
const router = express_1.default.Router();
router.route("/api/posts/new/:userId").post(authController_1.requireSignIn, postController_1.createPost);
router.route("/api/posts/photo/:postId").get(postController_1.getPhoto);
router.route("/api/posts/by/:userId").get(authController_1.requireSignIn, postController_1.listPostsByUser);
router.route("/api/posts/feed/:userId").get(authController_1.requireSignIn, postController_1.listNewsFeed);
router.route("/api/posts/like").put(authController_1.requireSignIn, postController_1.like);
router.route("/api/posts/unlike").put(authController_1.requireSignIn, postController_1.unlike);
router.route("/api/posts/comment").post(authController_1.requireSignIn, postController_1.comment);
router.route("/api/posts/uncomment").post(authController_1.requireSignIn, postController_1.uncomment);
router.route("/api/posts/:postId").delete(authController_1.requireSignIn, postController_1.isPoster, postController_1.remove);
router.param("userId", userController_1.userById);
router.param("postId", postController_1.postById);
exports.default = router;
//# sourceMappingURL=postRoutes.js.map