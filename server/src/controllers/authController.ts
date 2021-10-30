import User from "../models/userModel";
import expressjwt from "express-jwt";
import jwt from "jsonwebtoken";
import config from "../config/config";
import { Request, Response, NextFunction } from "express";
interface Requestextended extends Request {
  profile?: any; // or any other type
  auth?: any;
}
//signIn logic
async function signin(req: Request, res: Response) {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    if (!user.authenticate(req.body.password)) {
      res.status(400).json("password isn't correct");
    }
    const token = jwt.sign({ _id: user._id }, config.jwtSecret);
    res.cookie("t", token, { expires: new Date(Date.now() + 9999 * 1000) });
    return res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    return res.status(401).json({ error: "could not sign in" });
  }
}

async function signout(req: Request, res: Response) {
  res.clearCookie("t");
  res.status(200).json({
    message: "User Signed Out",
  });
}

const requireSignIn = expressjwt({
  algorithms: ["HS256"],
  secret: config.jwtSecret,
  userProperty: "auth",
});



async function hasAuthorization(
  req: Requestextended,
  res: Response,
  next: NextFunction
) {
  const authorized =
    req.profile &&
    req.auth &&
    req.profile._id.toString() === req.auth._id.toString();
  if (!authorized) {
    return res.status(403).json({ error: "User is not authorized" });
  }
  next();
}

export { signin, signout, hasAuthorization, requireSignIn };
