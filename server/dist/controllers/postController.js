"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listPostsByUser = exports.listNewsFeed = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const dbErrorHandler_1 = __importDefault(require("../helper/dbErrorHandler"));
async function listNewsFeed(req, res) {
    const following = req.profile.following;
    following.push(req.profile._id);
    try {
        const posts = await userModel_1.default.find({ postedBy: { $in: following } })
            .populate("comments.postedBy", "_id name")
            .populate("postedBy", "_id name")
            .sort("-createdAt")
            .exec();
        return res.json(posts);
    }
    catch (err) {
        return res.status(400).json({
            error: dbErrorHandler_1.default.getErrorMessage(err),
        });
    }
}
exports.listNewsFeed = listNewsFeed;
async function listPostsByUser(req, res) {
    try {
        const posts = await userModel_1.default.find({ postedBy: req.profile._id })
            .populate("comments.postedBy", "_id name")
            .populate("postedBy", "_id name")
            .sort("-createdAt")
            .exec();
        return res.json(posts);
    }
    catch (err) {
        return res.status(400).json({
            error: dbErrorHandler_1.default.getErrorMessage(err),
        });
    }
}
exports.listPostsByUser = listPostsByUser;
//# sourceMappingURL=postController.js.map