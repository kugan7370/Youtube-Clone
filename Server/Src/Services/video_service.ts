import { NextFunction } from "express";
import { userResponse, userUpdateProps } from "../@types/user_type";
import { addVideoProps, videoResponse, videoUpdateProps } from "../@types/video_types";
import User from "../Models/user_models";
import Video from "../Models/video_models";
import { getUserById } from "./user_service";

export const addVideo = async (video: addVideoProps, next: NextFunction) => {
    const { user, ...rest } = video;
    try {
        const addVideo = new Video({ ...rest, userId: user._id });
        const newVideo = await addVideo.save();
        return newVideo;
    } catch (error) {
        throw next(error);
    }
}


export const getAllVideo = async (next: NextFunction) => {
    try {
        const video = await Video.find({});
        return video;
    } catch (error) {
        throw next(error);
    }
}


export const getVideoByUser = async (userId: string, next: NextFunction) => {
    try {
        const video = await Video.find({ userId: userId });
        if (video) {
            const addedVideo = await Promise.all(video.map(async (video) => {
                const user = await User.findById(userId);

                if (user) {
                    const videoWithUserDetails: videoResponse = video.toObject();
                    videoWithUserDetails.userDetails = user.toObject();
                    return videoWithUserDetails;
                }
            }))
            return addedVideo;
        }

    } catch (error) {
        throw next(error);
    }

}

export const updateVideo = async (VideoId: string, video: videoUpdateProps, next: NextFunction) => {
    const { user, ...rest } = video;

    try {
        const updateVideo = await Video.findByIdAndUpdate(VideoId, { ...rest, userId: user._id }, { new: true });
        return updateVideo;
    } catch (error) {
        throw next(error);
    }

}


export const deleteVideo = async (videoId: string, next: NextFunction) => {
    try {
        const deleteVideo = await Video.findByIdAndDelete(videoId);
        return deleteVideo;

    } catch (error) {
        throw next(error);
    }

}

export const likedVideo = async (videoId: string, user: userUpdateProps, next: NextFunction) => {
    console.log(user);

    try {

        const video = await Video.findById(videoId);
        if (video) {
            const isLiked = video.likedBy.find((like) => like.toString() === user.user._id.toString());
            const isDisliked = video.dislikedBy.find((dislike) => dislike.toString() === user.user._id.toString());
            if (isLiked) {
                //remove isLiked from likedBy array
                video.likedBy = video.likedBy.filter((like) => like.toString() !== user.user._id.toString());
                video.likes = video.likes - 1;
                video.dislikes = video.dislikes + 1;
                video.dislikedBy.push(user.user._id);
                await video.save();
            }
            if (isDisliked) {
                video.dislikedBy = video.dislikedBy.filter((dislike) => dislike.toString() !== user.user._id.toString());
                video.dislikes = video.dislikes - 1;
                video.likes = video.likes + 1;
                video.likedBy.push(user.user._id);
                await video.save();
            }
            if (!isLiked && !isDisliked) {
                video.likedBy.push(user.user._id);
                video.likes = video.likes + 1;
                await video.save();
            }


        }
        return video;

    } catch (error) {
        throw next(error);
    }

}

export const viewVideo = async (videoId: string, next: NextFunction) => {
    try {
        const video = await Video.findById(videoId);
        if (video) {
            video.views = video.views + 1;
            await video.save();
        }
        return video;

    } catch (error) {
        throw next(error);

    }

}


