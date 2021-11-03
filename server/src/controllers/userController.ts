import User from "../models/userModel";
import extend from "lodash/extend";
import { Request, Response, NextFunction } from "express";
import errorHandler from "../helper/dbErrorHandler";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import IncomingForm from "formidable/Formidable";

interface Requestextended extends Request {
  profile?: any; // or any other type. yes
}

interface formidablextended extends IncomingForm {
  keepExtensions?: any;
}

//create a new user: POST REQUEST
async function addUser(req: Request, res: Response, next: NextFunction) {
  const user = new User(req.body);
  try {
    await user.save();
    return res.status(200).json({
      status: "okay",
      message: "User successfully signed up",
    });
  } catch (err: any) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
}

//GET ALL THE USERS:GET REQUEST
async function getAllUsers(req: Request, res: Response) {
  try {
    const users = await User.find({}).select("name email about createdAt");
    return res.status(200).json(users);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
}

//MIDDLEWARE TO GET A USER:
async function userById(
  req: Requestextended,
  res: Response,
  next: NextFunction,
  id: string
) {
  try {
    let user = await User.findById(id)
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
  } catch (err) {
    return res.status(400).json({
      error: "Could not retrieve User",
    });
  }
}

//GET A SINGLE USER: GET REQUEST WITH ID
async function getSingleUser(req: Requestextended, res: Response) {
  req.profile.hash_password = undefined;
  req.profile.salt = undefined;
  return res.status(200).json(req.profile);
}

//UPDATE A USER IN THE DB: PUT REQUEST
async function updateUser(req: Requestextended, res: Response) {
  let form: formidablextended = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err: any, fields: any, files: any) => {
    if (err) {
      return res.status(400).json({
        error: "Photo could not be uploaded",
      });
    }
    let user = req.profile;
    user = extend(user, fields);
    // console.log("mogbomoya", files.photo);
    if (files.photo) {
      user.photo.data = fs.readFileSync(files.photo.filepath);
      user.photo.contentType = files.photo.mimetype;
    }
    try {
      await user.save();
      // console.log(user);
      user.hash_password = undefined;
      user.salt = undefined;
      return res.json(user);
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err),
      });
    }
  });
}

//DELETE A USER FROM DB: DELETE REQUEST
async function deleteUser(req: Requestextended, res: Response) {
  try {
    let user = req.profile;
    let deletedUser = await user.remove();
    deletedUser.hash_password = undefined;
    deletedUser.salt = undefined;
    return res.json(deletedUser);
  } catch (err) {
    return res.status(400).json({
      err: errorHandler.getErrorMessage(err),
    });
  }
}

async function photo(req: Requestextended, res: Response, next: NextFunction) {
  if (req.profile.photo.data) {
    res.set("Content-Type", req.profile.photo.contentType);
    return res.send(req.profile.photo.data);
  } else {
    next();
  }
}

async function defaultPhoto(req: Requestextended, res: Response) {
  return res.sendFile(
    path.join(__dirname, "..", "..", "public/images/defphoto.png")
  );
}

async function addFollowing(
  req: Requestextended,
  res: Response,
  next: NextFunction
) {
  try {
    await User.findByIdAndUpdate(req.body.userId, {
      $push: { following: req.body.followId },
    });
    next();
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
}

async function addFollower(req: Requestextended, res: Response) {
  try {
    let result: any = await User.findByIdAndUpdate(
      req.body.followId,
      { $push: { followers: req.body.userId } },
      { new: true }
    )
      .populate("following", "_id name")
      .populate("followers", "_id name")
      .exec();
    result.hashed_password = undefined;
    result.salt = undefined;
    return res.json(result);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
}

async function removeFollowing(
  req: Requestextended,
  res: Response,
  next: NextFunction
) {
  try {
    await User.findByIdAndUpdate(req.body.userId, {
      $push: { following: req.body.followId },
    });
    next();
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
}

async function removeFollower(req: Requestextended, res: Response) {
  try {
    let result: any = await User.findByIdAndUpdate(
      req.body.followId,
      { $push: { followers: req.body.userId } },
      { new: true }
    )
      .populate("following", "_id name")
      .populate("followers", "_id name")
      .exec();
    result.hashed_password = undefined;
    result.salt = undefined;
    return res.json(result);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
}

export {
  addUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  userById,
  defaultPhoto,
  photo,
  addFollowing,
  addFollower,
  removeFollowing,
  removeFollower,
};
