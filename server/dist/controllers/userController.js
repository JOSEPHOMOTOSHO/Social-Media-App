"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userById = exports.deleteUser = exports.updateUser = exports.getSingleUser = exports.getAllUsers = exports.addUser = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const extend_1 = __importDefault(require("lodash/extend"));
const dbErrorHandler_1 = __importDefault(require("../helper/dbErrorHandler"));
//create a new user: POST REQUEST
async function addUser(req, res, next) {
    const user = new userModel_1.default(req.body);
    try {
        await user.save();
        return res.status(200).json({
            status: "okay",
            message: "User successfully signed up",
        });
    }
    catch (err) {
        res.status(400).json({
            error: dbErrorHandler_1.default.getErrorMessage(err),
        });
    }
}
exports.addUser = addUser;
//GET ALL THE USERS:GET REQUEST
async function getAllUsers(req, res) {
    try {
        const users = await userModel_1.default.find({}).select("name email about createdAt");
        res.status(200).json(users);
    }
    catch (err) {
        return res.status(400).json({
            error: dbErrorHandler_1.default.getErrorMessage(err),
        });
    }
}
exports.getAllUsers = getAllUsers;
//MIDDLEWARE TO GET A USER:
async function userById(req, res, next, id) {
    try {
        let user = await userModel_1.default.findById(id);
        if (!user) {
            res.status(400).json({
                error: "User not found",
            });
        }
        req.profile = user;
        next();
    }
    catch (err) {
        return res.status(400).json({
            error: "Could not retrieve User",
        });
    }
}
exports.userById = userById;
//GET A SINGLE USER: GET REQUEST WITH ID
async function getSingleUser(req, res) {
    req.profile.hash_password = undefined;
    req.profile.salt = undefined;
    return res.status(200).json(req.profile);
}
exports.getSingleUser = getSingleUser;
//UPDATE A USER IN THE DB: PUT REQUEST
async function updateUser(req, res) {
    try {
        let user = req.profile;
        user = (0, extend_1.default)(user, req.body);
        await user.save();
        console.log(user);
        user.hash_password = undefined;
        user.salt = undefined;
        res.json(user);
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({
            error: dbErrorHandler_1.default.getErrorMessage(err),
        });
    }
}
exports.updateUser = updateUser;
//DELETE A USER FROM DB: DELETE REQUEST
async function deleteUser(req, res) {
    try {
        let user = req.profile;
        let deletedUser = await user.remove();
        deletedUser.hash_password = undefined;
        deletedUser.salt = undefined;
        res.json(deletedUser);
    }
    catch (err) {
        return res.status(400).json({
            err: dbErrorHandler_1.default.getErrorMessage(err),
        });
    }
}
exports.deleteUser = deleteUser;
//# sourceMappingURL=userController.js.map