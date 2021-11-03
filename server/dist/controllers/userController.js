"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFollower = exports.removeFollowing = exports.addFollower = exports.addFollowing = exports.photo = exports.defaultPhoto = exports.userById = exports.deleteUser = exports.updateUser = exports.getSingleUser = exports.getAllUsers = exports.addUser = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const extend_1 = __importDefault(require("lodash/extend"));
const dbErrorHandler_1 = __importDefault(require("../helper/dbErrorHandler"));
const formidable_1 = __importDefault(require("formidable"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
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
        return res.status(400).json({
            error: dbErrorHandler_1.default.getErrorMessage(err),
        });
    }
}
exports.addUser = addUser;
//GET ALL THE USERS:GET REQUEST
async function getAllUsers(req, res) {
    try {
        const users = await userModel_1.default.find({}).select("name email about createdAt");
        return res.status(200).json(users);
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
        let user = await userModel_1.default.findById(id)
            .populate("following", "_id name")
            .populate("followers", "_id name")
            .exec();
        if (!user) {
            return res.status(400).json({
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
    let form = new formidable_1.default.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Photo could not be uploaded",
            });
        }
        let user = req.profile;
        user = (0, extend_1.default)(user, fields);
        // console.log("mogbomoya", files.photo);
        if (files.photo) {
            user.photo.data = fs_1.default.readFileSync(files.photo.filepath);
            user.photo.contentType = files.photo.mimetype;
        }
        try {
            await user.save();
            // console.log(user);
            user.hash_password = undefined;
            user.salt = undefined;
            return res.json(user);
        }
        catch (err) {
            console.log(err);
            return res.status(400).json({
                error: dbErrorHandler_1.default.getErrorMessage(err),
            });
        }
    });
}
exports.updateUser = updateUser;
//DELETE A USER FROM DB: DELETE REQUEST
async function deleteUser(req, res) {
    try {
        let user = req.profile;
        let deletedUser = await user.remove();
        deletedUser.hash_password = undefined;
        deletedUser.salt = undefined;
        return res.json(deletedUser);
    }
    catch (err) {
        return res.status(400).json({
            err: dbErrorHandler_1.default.getErrorMessage(err),
        });
    }
}
exports.deleteUser = deleteUser;
async function photo(req, res, next) {
    if (req.profile.photo.data) {
        res.set("Content-Type", req.profile.photo.contentType);
        return res.send(req.profile.photo.data);
    }
    else {
        next();
    }
}
exports.photo = photo;
async function defaultPhoto(req, res) {
    return res.sendFile(path_1.default.join(__dirname, "..", "..", "public/images/defphoto.png"));
}
exports.defaultPhoto = defaultPhoto;
async function addFollowing(req, res, next) {
    try {
        await userModel_1.default.findByIdAndUpdate(req.body.userId, {
            $push: { following: req.body.followId },
        });
        next();
    }
    catch (err) {
        return res.status(400).json({
            error: dbErrorHandler_1.default.getErrorMessage(err),
        });
    }
}
exports.addFollowing = addFollowing;
async function addFollower(req, res) {
    try {
        let result = await userModel_1.default.findByIdAndUpdate(req.body.followId, { $push: { followers: req.body.userId } }, { new: true })
            .populate("following", "_id name")
            .populate("followers", "_id name")
            .exec();
        result.hashed_password = undefined;
        result.salt = undefined;
        return res.json(result);
    }
    catch (err) {
        return res.status(400).json({
            error: dbErrorHandler_1.default.getErrorMessage(err),
        });
    }
}
exports.addFollower = addFollower;
async function removeFollowing(req, res, next) {
    try {
        await userModel_1.default.findByIdAndUpdate(req.body.userId, {
            $push: { following: req.body.followId },
        });
        next();
    }
    catch (err) {
        return res.status(400).json({
            error: dbErrorHandler_1.default.getErrorMessage(err),
        });
    }
}
exports.removeFollowing = removeFollowing;
async function removeFollower(req, res) {
    try {
        let result = await userModel_1.default.findByIdAndUpdate(req.body.followId, { $push: { followers: req.body.userId } }, { new: true })
            .populate("following", "_id name")
            .populate("followers", "_id name")
            .exec();
        result.hashed_password = undefined;
        result.salt = undefined;
        return res.json(result);
    }
    catch (err) {
        return res.status(400).json({
            error: dbErrorHandler_1.default.getErrorMessage(err),
        });
    }
}
exports.removeFollower = removeFollower;
//# sourceMappingURL=userController.js.map