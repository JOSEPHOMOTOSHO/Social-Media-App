import mongoose, { Schema } from "mongoose";

interface photo {
  data: Buffer;
  contentType: String;
}

export interface Post extends mongoose.Document {
  text: string;
  photo: photo;
  likes: string;
  postedBy: string;
  comments: string[];
}
const postModel = new Schema(
  {
    text: {
      type: String,
      required: "Text is required",
    },

    photo: {
      data: Buffer,
      contentType: String,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },

    Likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
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
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const PostModel = mongoose.model<Post>("posts", postModel);
export default PostModel;
