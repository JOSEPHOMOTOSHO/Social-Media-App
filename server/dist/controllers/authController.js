"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireSignIn = exports.hasAuthorization = exports.signout = exports.signin = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const express_jwt_1 = __importDefault(require("express-jwt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
//signIn logic
async function signin(req, res) {
    try {
        let user = await userModel_1.default.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }
        if (!user.authenticate(req.body.password)) {
            return res.status(400).json({ error: "password isn't correct" });
        }
        const token = jsonwebtoken_1.default.sign({ _id: user._id }, config_1.default.jwtSecret);
        res.cookie("t", token, { expires: new Date(Date.now() + 9999 * 1000) });
        return res.json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                about: user.about
            },
        });
    }
    catch (err) {
        return res.status(401).json({ error: "could not sign in", err });
    }
}
exports.signin = signin;
async function signout(req, res) {
    res.clearCookie("t");
    res.status(200).json({
        message: "User Signed Out",
    });
}
exports.signout = signout;
const requireSignIn = (0, express_jwt_1.default)({
    algorithms: ["HS256"],
    secret: config_1.default.jwtSecret,
    userProperty: "auth",
});
exports.requireSignIn = requireSignIn;
async function hasAuthorization(req, res, next) {
    const authorized = req.profile &&
        req.auth &&
        req.profile._id.toString() === req.auth._id.toString();
    if (!authorized) {
        return res.status(403).json({ error: "User is not authorized" });
    }
    next();
}
exports.hasAuthorization = hasAuthorization;
//# sourceMappingURL=authController.js.map