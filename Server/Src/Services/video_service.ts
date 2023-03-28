import { NextFunction, Request } from "express";
import mongoose from "mongoose";
import { CommentResponces } from "../@types/comment_types";
import { userUpdateProps } from "../@types/user_type";
import { addVideoProps, videoUpdateProps } from "../@types/video_types";
import User from "../Models/user_models";
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

export const getAllVideo = async (req: Request, next: NextFunction, sortByViews?: boolean, randomVideos?: boolean, userSubcription?: boolean, isSearch?: boolean, isSingleVideo?: boolean, isUserVideo?: boolean) => {
    const { user } = req.body;
    try {
        const videoPipeline = [
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "postedBy"
                }
            },
            {
                $lookup: {
                    from: "comments",
                    localField: "comments",
                    foreignField: "_id",
                    as: "commentDetails"
                }
            },
            { $unwind: "$postedBy" },
            { $project: { "postedBy.password": 0, "comments": 0, "userId": 0 } }
        ];

        if (sortByViews) {
            videoPipeline.push({ $sort: { views: -1 } } as any);
        }
        if (randomVideos) {
            videoPipeline.push({ $sample: { size: 10 } } as any);
        }
        if (userSubcription) {
            // get user subscriptions
            const userSubcriptionData = await User.findById(user._id)

            if (!userSubcriptionData) throw new Error("User did not subscribe to any channel");
            const userSubcriptions = userSubcriptionData?.subscribtions;
            const changedTypes = userSubcriptions.map((item) => new mongoose.Types.ObjectId(item))
            videoPipeline.push({ $match: { "postedBy._id": { $in: changedTypes } } } as any);

        }

        if (isSearch) {
            videoPipeline.push({ $match: { title: { $regex: req.body.search, $options: "i" } } } as any);
        }

        if (isSingleVideo) {
            videoPipeline.push({ $match: { _id: new mongoose.Types.ObjectId(req.params.videoId) } } as any);
        }
        if (isUserVideo) {
            videoPipeline.push({ $match: { "postedBy._id": user._id } } as any);
        }

        const video = await Video.aggregate(videoPipeline);

        if (video) {
            await Promise.all(video.map(async (item) => {
                if (item.commentDetails.length > 0) {
                    await Promise.all(item.commentDetails.map(async (comments: CommentResponces) => {
                        const getUserDetails = await User.findById(comments.userId).lean();

                        if (getUserDetails) {
                            comments.username = getUserDetails.username;
                            comments.email = getUserDetails.email;
                            if (getUserDetails.img) {
                                comments.img = getUserDetails.img
                            }
                        }

                    }))
                }
            }))

        }

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




