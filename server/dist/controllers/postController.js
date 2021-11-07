"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uncomment = exports.comment = exports.unlike = exports.like = exports.remove = exports.isPoster = exports.postById = exports.getPhoto = exports.createPost = exports.listPostsByUser = exports.listNewsFeed = void 0;
const postModel_1 = __importDefault(require("../models/postModel"));
const dbErrorHandler_1 = __importDefault(require("../helper/dbErrorHandler"));
const formidable_1 = __importDefault(require("formidable"));
const fs_1 = __importDefault(require("fs"));
async function listNewsFeed(req, res) {
    const following = req.profile.following;
    following.push(req.profile._id);
    try {
        const posts = await postModel_1.default.find({ postedBy: { $in: following } })
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
        const posts = await postModel_1.default.find({ postedBy: req.profile._id })
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
async function createPost(req, res, next) {
    let form = new formidable_1.default.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded",
            });
        }
        let post = new postModel_1.default(fields);
        post.postedBy = req.profile;
        if (files.photo) {
            post.photo.data = fs_1.default.readFileSync(files.photo.filepath);
            post.photo.contentType = files.photo.mimetype;
        }
        try {
            let result = await post.save();
            return res.json(result);
        }
        catch (err) {
            return res.status(400).json({
                error: dbErrorHandler_1.default.getErrorMessage(err),
            });
        }
    });
}
exports.createPost = createPost;
async function postById(req, res, next, id) {
    try {
        let post = await postModel_1.default.findById(id).populate("postedBy", "_id name").exec();
        if (!post) {
            return res.status(400).json({
                error: "No such post",
            });
        }
        req.post = post;
        next();
    }
    catch (err) {
        return res.status(401).json({
            error: "could not retrieve post",
        });
    }
}
exports.postById = postById;
async function getPhoto(req, res, next) {
    res.set("Content-Type", req.post.photo.contentType);
    console.log("i am", req.post.photo.contentType);
    return res.send(req.post.photo.data);
}
exports.getPhoto = getPhoto;
function isPoster(req, res, next) {
    const isPoster = req.post &&
        req.auth &&
        req.post.postedBy._id.toString() === req.auth._id.toString();
    if (!isPoster) {
        return res.status(403).json({
            error: "User not authorized",
        });
    }
    next();
}
exports.isPoster = isPoster;
function remove(req, res) {
    const post = req.post;
    try {
        const deletedPost = post.remove();
        return res.json(deletedPost);
    }
    catch (err) {
        return res.status(400).json({
            error: dbErrorHandler_1.default.getErrorMessage(err),
        });
    }
}
exports.remove = remove;
async function like(req, res) {
    try {
        const result = await postModel_1.default.findByIdAndUpdate(req.body.postId, { $push: { Likes: req.body.userId } }, { new: true });
        return res.json(result);
    }
    catch (err) {
        return res.status(400).json({
            error: dbErrorHandler_1.default.getErrorMessage(err),
        });
    }
}
exports.like = like;
async function unlike(req, res) {
    try {
        const result = await postModel_1.default.findByIdAndUpdate(req.body.postId, { $pull: { Likes: req.body.userId } }, { new: true });
        return res.json(result);
    }
    catch (err) {
        return res.status(400).json({
            error: dbErrorHandler_1.default.getErrorMessage(err),
        });
    }
}
exports.unlike = unlike;
async function comment(req, res) {
    let comment = req.body.comment;
    comment.postedBy = req.body.userId;
    try {
        const result = await postModel_1.default.findByIdAndUpdate(req.body.postId, { $push: { comments: comment } }, { new: true })
            .populate("comments.postedBy", "_id name")
            .populate("postedBy", "_id name")
            .exec();
        return res.json(result);
    }
    catch (err) {
        return res.status(400).json({
            error: dbErrorHandler_1.default.getErrorMessage(err),
        });
    }
}
exports.comment = comment;
async function uncomment(req, res) {
    let comment = req.body.comment;
    try {
        let result = await postModel_1.default.findByIdAndUpdate(req.body.postId, {
            $pull: { comments: comment._id },
        }, { new: true })
            .populate("comments.postedBy", "_id name")
            .populate("postedBy", "_id name")
            .exec();
        return res.json(result);
    }
    catch (err) {
        return res.status(400).json({
            error: dbErrorHandler_1.default.getErrorMessage(err),
        });
    }
}
exports.uncomment = uncomment;
//# sourceMappingURL=postController.js.map