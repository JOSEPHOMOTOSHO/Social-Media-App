"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const crypto_1 = __importDefault(require("crypto"));
//CREATE A USER SCHEMA
const userModel = new mongoose_1.Schema({
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
    following: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" }],
    followers: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" }],
    hash_password: {
        type: String,
        required: "Password is required",
    },
    salt: String,
}, { timestamps: true });
//setting password property that wunt be persisted into that mongodb
//handling password as a virtual field and not a real mongodb doc property
userModel
    .virtual("password")
    .set(function (password) {
    this._password = password;
    this.salt = this === null || this === void 0 ? void 0 : this.makeSalt();
    this.hash_password = this === null || this === void 0 ? void 0 : this.encryptPassword(password);
})
    .get(function () {
    return this.hash_password;
});
//encryption and authentication. create methods that can be applied on our document in mongodb
userModel.methods = {
    authenticate: function (plaintext) {
        return this.encryptPassword(plaintext) === this.hash_password;
    },
    encryptPassword: function (password) {
        if (!password)
            return "";
        try {
            return crypto_1.default
                .createHmac("sha1", this.salt)
                .update(password)
                .digest("hex");
        }
        catch (err) {
            return "";
        }
    },
    makeSalt: function () {
        return Math.round(new Date().valueOf() * Math.random()) + "";
    },
};
//password field validtaion: validating the user password BEFOR BEING STORED IN DB
userModel.path("hash_password").validate(function () {
    if (this._password && this._password.length < 6) {
        this.invalidate("password", "Password must be atleast 6 characters.");
    }
    if (this.isNew && !this._password) {
        this.invalidate("password", "password is required");
    }
}, "");
const UserModel = mongoose_1.default.model("users", userModel);
exports.default = UserModel;
//# sourceMappingURL=userModel.js.map