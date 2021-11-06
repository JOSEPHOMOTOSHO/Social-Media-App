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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const postModel = new mongoose_1.Schema({
    text: {
        type: String,
        required: "Text is required",
    },
    photo: {
        data: Buffer,
        contentType: String,
    },
    postedBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "users",
    },
    Likes: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "users",
        },
    ],
    comments: [
        {
            text: String,
            created: {
                type: Date,
                default: Date.now,
            },
            postedBy: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "users",
            },
        },
    ],
}, {
    timestamps: true,
});
const PostModel = mongoose_1.default.model("posts", postModel);
exports.default = PostModel;
//# sourceMappingURL=postModel.js.map