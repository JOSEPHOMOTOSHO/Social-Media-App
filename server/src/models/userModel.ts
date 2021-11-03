import { SSL_OP_CRYPTOPRO_TLSEXT_BUG } from 'constants';
import mongoose, {Schema} from 'mongoose'
import crypto from 'crypto'

//create our schema interface and the types for each property related to the schema
export interface User extends mongoose.Document {
  name: string;
  email: string;
  about: string;
  photo: string;
  following: {}[];
  followers: {}[];
  hash_password: string;
  _password: string;
  salt: string;
  encryptPassword(str: string): any;
  makeSalt(): any;
  authenticate(str: string): boolean;
}

//CREATE A USER SCHEMA
const userModel = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      match: new RegExp(/.+\@.+\..+/),
      required: [true, "Email is required"],
    },
    about: {
      type: String,
      trim: true,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    hash_password: {
      type: String,
      required: "Password is required",
    },
    salt: String,
  },
  { timestamps: true }
);

//setting password property that wunt be persisted into that mongodb
//handling password as a virtual field and not a real mongodb doc property
userModel
  .virtual("password")
  .set(function (this: User, password: string) {
    this._password = password;
    this.salt = this?.makeSalt();
    this.hash_password = this?.encryptPassword(password);
  })
  .get(function (this: User) {
    return this.hash_password;
  });

//encryption and authentication. create methods that can be applied on our document in mongodb
userModel.methods = {
  authenticate: function (plaintext) {
    return this.encryptPassword(plaintext) === this.hash_password;
  },

  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },

  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + "";
  },
};

//password field validtaion: validating the user password BEFOR BEING STORED IN DB
userModel.path("hash_password").validate(function (this: User) {
  if (this._password && this._password.length < 6) {
    this.invalidate("password", "Password must be atleast 6 characters.");
  }
  if (this.isNew && !this._password) {
    this.invalidate("password", "password is required");
  }
}, "");

const UserModel = mongoose.model<User>("users", userModel);
export default UserModel;
