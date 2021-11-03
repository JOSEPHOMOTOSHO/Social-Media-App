import  express from 'express';
import {Request,Response,NextFunction} from 'express'
import template from '../template'
import {
  getAllUsers,
  addUser,
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
} from "../controllers/userController";
import { requireSignIn, hasAuthorization } from "../controllers/authController";
var router = express.Router();

router.route("/api/users").get(getAllUsers).post(addUser);

router
  .route("/api/users/:userId")
  .get(requireSignIn, getSingleUser)
  .put(requireSignIn, hasAuthorization, updateUser)
  .delete(requireSignIn, hasAuthorization, deleteUser);
router.route("/api/users/photo/:userId").get(photo, defaultPhoto);
router.route("/api/users/defaultphoto").get(defaultPhoto);
router.route("/api/users/follow").put(requireSignIn, addFollowing, addFollower);
router
  .route("/api/users/unfollow")
  .put(requireSignIn, removeFollowing, removeFollower);

router.param('userId',userById)
export default router;
