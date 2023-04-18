import { NextFunction, Request } from "express";
import { CommentInput } from "../@types/comment_types";
import Comment from "../Models/comments_models";
import Video from "../Models/video_models";
import createError from "../Utils/createError";
import User from "../Models/user_models";


export const addComment = async (comment: CommentInput, userId: string, next: NextFunction) => {

    try {
        const addComment = new Comment({ ...comment, userId });
        const newComment = await addComment.save();

        const addCommentVideo = await Video.findByIdAndUpdate(comment.videoId, { $push: { comments: addComment._id } }, { new: true })
        if (!addCommentVideo) {
            return next(createError(404, "Video not found"))
        }

        return newComment;
    } catch (error) {
        throw next(error);
    }


}

export const getcomment = async (next: NextFunction) => {
    try {
        const comment = await Comment.aggregate([{
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userDetails"
            },
        }, {
            $lookup: {
                from: "videos",
                localField: "videoId",
                foreignField: "_id",
                as: "videoDetails"
            }
            //remove password from userDetails
        }, { $unwind: "$userDetails" }, { $project: { "userDetails.password": 0 } }]);
        return comment;
    } catch (error) {
        throw next(error);
    }


}

export const deleteComment = async (commentId: string, userId: string, next: NextFunction) => {
    try {
        const deleteFromVideo = await Video.updateMany({}, { $pull: { comments: commentId } });
        if (!deleteFromVideo) {
            return next(createError(404, "Comment not found"))
        }

        const comment = await Comment.findOne({ _id: commentId });
        if (!comment) {
            return next(createError(404, "Comment not found"))
        }

        if (comment.userId.toString() != userId) {
            return next(createError(401, "You are not authorized to delete this comment"))
        }

        const deletedComment = await Comment.findByIdAndDelete(commentId);
        return deletedComment;



    } catch (error) {
        throw next(error);
    }

}

export const getCommentByVideoId = async (req: Request, next: NextFunction) => {
    const { videoId } = req.params;
    try {
        const comment = await Comment.find({ videoId }).sort({ createdAt: -1 }).lean();
        if (comment) {
            const result = await Promise.all(comment.map(async (item) => {
                const userDetails = await User.findById(item.userId)
                if (!userDetails) return next(createError(404, "User not found"))
                return {
                    ...item,
                    username: userDetails.username,
                    email: userDetails.email,
                    img: userDetails.img,
                }

            }))
            return result;
        }



    } catch (error) {
        throw next(error);
    }
}