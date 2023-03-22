import { Document } from "mongoose";

export interface CommentInput extends Document {
    comment: string;
    userId: string;
    videoId: string;
}

export interface CommentResponces {
    comment: string;
    userId: string;
    username: string;
    email: string;
    img: string;

} 