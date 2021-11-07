import Post from "../models/postModel";
import { Request, Response, NextFunction } from "express";
import errorHandler from "../helper/dbErrorHandler";
import formidable from "formidable";
import IncomingForm from "formidable/Formidable";
import fs from "fs";

interface Requestextended extends Request {
  profile?: any; // or any other type. yes
  post?: any;
  auth?: any;
}
interface formidablextended extends IncomingForm {
  keepExtensions?: any;
}
async function listNewsFeed(req: Requestextended, res: Response) {
  const following = req.profile.following;
  following.push(req.profile._id);
  try {
    const posts = await Post.find({ postedBy: { $in: following } })
      .populate("comments.postedBy", "_id name")
      .populate("postedBy", "_id name")
      .sort("-createdAt")
      .exec();

    return res.json(posts);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
}

async function listPostsByUser(req: Requestextended, res: Response) {
  try {
    const posts = await Post.find({ postedBy: req.profile._id })
      .populate("comments.postedBy", "_id name")
      .populate("postedBy", "_id name")
      .sort("-createdAt")
      .exec();

    return res.json(posts);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
}

async function createPost(
  req: Requestextended,
  res: Response,
  next: NextFunction
) {
  let form: formidablextended = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err: any, fields: any, files: any) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded",
      });
    }

    let post = new Post(fields);
    post.postedBy = req.profile;
    if (files.photo) {
      post.photo.data = fs.readFileSync(files.photo.filepath);
      post.photo.contentType = files.photo.mimetype;
    }
    try {
      let result = await post.save();
      return res.json(result);
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err),
      });
    }
  });
}

async function postById(
  req: Requestextended,
  res: Response,
  next: NextFunction,
  id: any
) {
  try {
    let post = await Post.findById(id).populate("postedBy", "_id name").exec();
    if (!post) {
      return res.status(400).json({
        error: "No such post",
      });
    }
    req.post = post;
    next();
  } catch (err) {
    return res.status(401).json({
      error: "could not retrieve post",
    });
  }
}

async function getPhoto(
  req: Requestextended,
  res: Response,
  next: NextFunction
) {
  res.set("Content-Type", req.post.photo.contentType);
  console.log("i am", req.post.photo.contentType);

  return res.send(req.post.photo.data);
}

function isPoster(req: Requestextended, res: Response, next: NextFunction) {
  const isPoster =
    req.post &&
    req.auth &&
    req.post.postedBy._id.toString() === req.auth._id.toString();
  if (!isPoster) {
    return res.status(403).json({
      error: "User not authorized",
    });
  }

  next();
}

function remove(req: Requestextended, res: Response) {
  const post = req.post;
  try {
    const deletedPost = post.remove();
    return res.json(deletedPost);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
}

async function like(req: Requestextended, res: Response) {
  try {
    const result = await Post.findByIdAndUpdate(
      req.body.postId,
      { $push: { Likes: req.body.userId } },
      { new: true }
    );

    return res.json(result);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
}

async function unlike(req: Requestextended, res: Response) {
  try {
    const result = await Post.findByIdAndUpdate(
      req.body.postId,
      { $pull: { Likes: req.body.userId } },
      { new: true }
    );

    return res.json(result);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
}
async function comment(req: Requestextended, res: Response) {
  let comment = req.body.comment;
  comment.postedBy = req.body.userId;
  try {
    const result = await Post.findByIdAndUpdate(
      req.body.postId,
      { $push: { comments: comment } },
      { new: true }
    )
      .populate("comments.postedBy", "_id name")
      .populate("postedBy", "_id name")
      .exec();

    return res.json(result);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
}

async function uncomment(req: Requestextended, res: Response) {
  let comment = req.body.comment;
  try {
    let result = await Post.findByIdAndUpdate(
      req.body.postId,
      {
        $pull: { comments: comment._id },
      },
      { new: true }
    )
      .populate("comments.postedBy", "_id name")
      .populate("postedBy", "_id name")
      .exec();

    return res.json(result);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
}

export {
  listNewsFeed,
  listPostsByUser,
  createPost,
  getPhoto,
  postById,
  isPoster,
  remove,
  like,
  unlike,
  comment,
  uncomment,
};
