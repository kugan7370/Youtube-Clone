import mongoose from "mongoose";
import { CommentInput } from "../@types/comment_types";

const commentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    videoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
        required: true,
    },

},
    { timestamps: true }
);

const Comment = mongoose.model<CommentInput>("Comment", commentSchema);

export default Comment;