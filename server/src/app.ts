import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import userRouter from "./routes/userRoutes";
import authRouter from "./routes/authRoutes";
import postRouter from "./routes/postRoutes";

var app = express();

import { Request, Response, NextFunction } from "express";
// view engine setup
app.set("views", path.join(__dirname, "..", "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/", userRouter);
app.use("/", authRouter);
app.use("/", postRouter);

// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: NextFunction) {
  next(createError(404));
});

// error handler
// app.use(function (
//   err: createError.HttpError,
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get("env") === "development" ? err : {};

//   // render the error page
//   // res.status(err.status || 500);
//   // res.render("error");
//   next();
// });

app.use(
  (
    err: createError.HttpError,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (err.name === "UnauthorizedError") {
      res.status(401).json({ error: err.name + ": " + err.message });
    } else if (err) {
      res.status(400).json({ error: err.name + ": " + err.message });
      console.log(err);
    }
  }
);

export default app;
