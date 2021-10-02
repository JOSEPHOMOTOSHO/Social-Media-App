import User from "../models/userModel";
import extend from "lodash/extend";
import { Request, Response, NextFunction } from "express";
import errorHandler from "../helper/dbErrorHandler";

interface Requestextended extends Request {
  profile?: any; // or any other type. yes
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
    res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
}

//GET ALL THE USERS:GET REQUEST
async function getAllUsers(req: Request, res: Response) {
  try {
    const users = await User.find({}).select("name email createdAt");
    res.status(200).json(users);
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
    let user = await User.findById(id);

    if (!user) {
      res.status(400).json({
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
  try {
    let user = req.profile;
    user = extend(user, req.body);
    await user.save();
    console.log(user);
    user.hash_password = undefined;
    user.salt = undefined;
    res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
}

//DELETE A USER FROM DB: DELETE REQUEST
async function deleteUser(req: Requestextended, res: Response) {
  try {
    let user = req.profile;
    let deletedUser = await user.remove();
    deletedUser.hash_password = undefined;
    deletedUser.salt = undefined;
    res.json(deletedUser);
  } catch (err) {
    return res.status(400).json({
      err: errorHandler.getErrorMessage(err),
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
};
