"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const authController_1 = require("../controllers/authController");
var router = express_1.default.Router();
router.route("/api/users").get(userController_1.getAllUsers).post(userController_1.addUser);
router
    .route("/api/users/:userId")
    .get(authController_1.requireSignIn, userController_1.getSingleUser)
    .put(authController_1.requireSignIn, authController_1.hasAuthorization, userController_1.updateUser)
    .delete(authController_1.requireSignIn, authController_1.hasAuthorization, userController_1.deleteUser);
router.route("/api/users/photo/:userId").get(userController_1.photo, userController_1.defaultPhoto);
router.route("/api/users/defaultphoto").get(userController_1.defaultPhoto);
router.param('userId', userController_1.userById);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map