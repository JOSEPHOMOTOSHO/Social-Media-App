"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
var router = express_1.default.Router();
router.post("/auth/signin", authController_1.signin);
router.get("/auth/signout", authController_1.signout);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map