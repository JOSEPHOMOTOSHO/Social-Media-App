import PostModel from "../models/userModel";
import { Request, Response, NextFunction } from "express";
import errorHandler from "../helper/dbErrorHandler";

interface Requestextended extends Request {
  profile?: any; // or any other type. yes
}

async function listNewsFeed(req: Requestextended, res: Response) {
  const following = req.profile.following;
  following.push(req.profile._id);
  try {
    const posts = await PostModel.find({ postedBy: { $in: following } })
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
    const posts = await PostModel.find({ postedBy: req.profile._id })
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

export { listNewsFeed, listPostsByUser };
