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
router.route("/api/posts/feed/:userId").get(authController_1.requireSignIn, postController_1.listNewsFeed);
router.route("/api/posts/by/:userId").get(authController_1.requireSignIn, postController_1.listPostsByUser);
router.param("userId", userController_1.userById);
exports.default = router;
//# sourceMappingURL=postRoutes.js.map