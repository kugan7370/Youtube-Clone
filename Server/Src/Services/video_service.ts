import { NextFunction, response } from "express";
import { userUpdateProps } from "../@types/user_type";
import { addVideoProps, videoUpdateProps } from "../@types/video_types";
import Video from "../Models/video_models";


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
        const video = await Video.aggregate([{
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userDetails"
            }
            //remove password from userDetails
        }, { $unwind: "$userDetails" }, { $project: { "userDetails.password": 0 } }])



        return video;
    } catch (error) {
        throw next(error);
    }
}


export const getVideoByUser = async (userId: string, next: NextFunction) => {
    try {

        const video = await Video.find({ userId }).populate("userId", "-password -_id -createdAt -updatedAt -__v").lean();
        if (video) {
            const updatedVideo = video.map((item) => {
                const { userId, ...rest } = item
                return {
                    ...rest,
                    userDetails: userId,
                };
            });
            return updatedVideo;
            // !! in here i have used lean() to get the data in json format
            // !! if not i need to use item.toObject() to get the data in json format

        }


    } catch (error) {
        throw next(error);
    }

}

export const updateVideo = async (VideoId: string, video: videoUpdateProps, next: NextFunction) => {
    const { user, ...rest } = video;

    try {
        const updateVideo = await Video.findByIdAndUpdate(VideoId, { ...rest, userId: user._id }, { new: true }).populate("userId", "-password");
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


    try {
        const video = await Video.findById(videoId);
        let message = "";
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
                message = "disliked successfully";
            }
            if (isDisliked) {
                video.dislikedBy = video.dislikedBy.filter((dislike) => dislike.toString() !== user.user._id.toString());
                video.dislikes = video.dislikes - 1;
                video.likes = video.likes + 1;
                video.likedBy.push(user.user._id);
                await video.save();
                message = "liked successfully";
            }
            if (!isLiked && !isDisliked) {
                video.likedBy.push(user.user._id);
                video.likes = video.likes + 1;
                await video.save();
                message = "liked successfully";
            }


        }
        return { video, message };

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


