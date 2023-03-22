import { NextFunction, Request, Response } from "express";
import { addComment, deleteComment, getcomment } from "../Services/comment_service";

export const addCommentHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { user, ...Comment } = req.body
    try {
        const comment = await addComment(Comment, user._id, next);
        if (comment) {
            return res.status(201).json({ message: "Comment added successfully", comment })
        }
    } catch (error) {
        return next(error);
    }

}

export const getCommentHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const comment = await getcomment(next);
        if (comment) {
            return res.status(201).json({ comment })
        }
    } catch (error) {
        return next(error);
    }

}

export const deleteCommentHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { _id } = req.body.user;
    try {
        const comment = await deleteComment(id, _id, next);
        if (comment) {
            return res.status(201).json({ message: "Comment deleted successfully" })
        }
    } catch (error) {
        return next(error);
    }

}