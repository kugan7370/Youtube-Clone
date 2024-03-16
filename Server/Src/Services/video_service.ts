import { NextFunction, Request } from "express";
import mongoose from "mongoose";
import { CommentResponces } from "../@types/comment_types";
import { userUpdateProps } from "../@types/user_type";
import { addVideoProps, videoUpdateProps } from "../@types/video_types";
import User from "../Models/user_models";
import Video from "../Models/video_models";
import { uploadFileToCloud, uploadVideoToCloud } from "../Utils/cloudinary";


export const addVideo = async (req: Request, next: NextFunction) => {
    const video = req.body;
    const { userId } = req.params




    if (req.files) {
        if ('thumbnail' in req.files) {
            const uploadThumbnail = await uploadFileToCloud(req.files.thumbnail[0].path);
            if (uploadThumbnail) {
                video.thumbnail = uploadThumbnail.secure_url;
            }

        }
        if ('video' in req.files) {
            const uploadVideo = await uploadVideoToCloud(req.files.video[0].path);
            if (uploadVideo) {
                video.video = uploadVideo.secure_url;
            }
        }

    }



    try {
        const addVideo = new Video({ ...video, userId });
        const newVideo = await addVideo.save();
        return newVideo;
    } catch (error) {
        throw next(error);
    }
}

export const getAllVideo = async (req: Request, next: NextFunction, isSingleVideo?: boolean) => {
// if search is available
   
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

        if (isSingleVideo) {
            videoPipeline.push({ $match: { _id: new mongoose.Types.ObjectId(req.params.videoId) } } as any);
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
                video.likedBy = video.likedBy.filter((like) => like.toString() !== user.user._id.toString());
                video.likes = video.likes - 1;
                await video.save();
                message = "disliked successfully";
            }
            else {
                if (isDisliked) {
                    video.dislikedBy = video.dislikedBy.filter((dislike) => dislike.toString() !== user.user._id.toString());
                    video.dislikes = video.dislikes - 1;
                }
                video.likedBy.push(new mongoose.Types.ObjectId(user.user._id));
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
export const disLikedVideo = async (videoId: string, user: userUpdateProps, next: NextFunction) => {


    try {
        const video = await Video.findById(videoId);
        let message = "";
        if (video) {
            const isLiked = video.likedBy.find((like) => like.toString() === user.user._id.toString());
            const isDisliked = video.dislikedBy.find((dislike) => dislike.toString() === user.user._id.toString());

            if (isDisliked) {
                video.dislikedBy = video.dislikedBy.filter((dislike) => dislike.toString() !== user.user._id.toString());
                video.dislikes = video.dislikes - 1;
                await video.save();
                message = "liked successfully";
            }
            else {
                if (isLiked) {
                    video.likedBy = video.likedBy.filter((like) => like.toString() !== user.user._id.toString());
                    video.likes = video.likes - 1;
                }
                video.dislikes = video.dislikes + 1;
                video.dislikedBy.push(new mongoose.Types.ObjectId(user.user._id));
                await video.save();
                message = "disliked successfully";
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

export const getTrendingVideos = async (next: NextFunction) => {
    try {
        const getVideo = await Video.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            { $unwind: "$userDetails" },
            { $project: { "userDetails.password": 0, "userId": 0 } },
            { $sort: { views: -1 } },

        ]);

        return getVideo;


    } catch (error) {
        throw next(error);
    }

}

export const getRandomVideos = async (next: NextFunction) => {
    try {
        const getVideo = await Video.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            { $unwind: "$userDetails" },
            { $project: { "userDetails.password": 0, "userId": 0 } },
            { $sample: { size: 10 } },

        ]);

        return getVideo;

    }
    catch (error) {
        throw next(error);
    }
}

export const getSubscriptionVideos = async (req: Request, next: NextFunction) => {
    const { user } = req.body

    try {

        // get user subscriptions
        const userSubcriptionData = await User.findById(user._id)

        if (!userSubcriptionData) throw new Error("User did not subscribe to any channel");
        const userSubcriptions = userSubcriptionData?.subscribtions;
        const changedTypes = userSubcriptions.map((item) => new mongoose.Types.ObjectId(item))


        const getVideo = await Video.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            { $unwind: "$userDetails" },
            { $project: { "userDetails.password": 0, "userId": 0 } },
            { $match: { "userDetails._id": { $in: changedTypes } } },
            { $sort: { createdAt: -1 } },

        ]);

        return getVideo;

    } catch (error) {
        throw next(error);
    }

}

export const getSearchVideos = async (req: Request, next: NextFunction) => {
console.log(req.query.search)
    try {
        const getVideo = await Video.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            { $unwind: "$userDetails" },
            { $project: { "userDetails.password": 0, "userId": 0 } },
            { $match: { title: { $regex: req.query.search, $options: "i" } } },
            { $sort: { createdAt: -1 } },

        ]);

        return getVideo;

    } catch (error) {
        throw next(error);
    }

}

export const getVideoByUser = async (req: Request, next: NextFunction) => {
    try {
        const getVideo = await Video.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            { $unwind: "$userDetails" },
            { $project: { "userDetails.password": 0, "userId": 0 } },
            { $match: { "userDetails._id": new mongoose.Types.ObjectId(req.body.user._id) } },
            { $sort: { createdAt: -1 } },

        ]);

        return getVideo;

    } catch (error) {
        throw next(error);
    }

}

export const getLikedVideos = async (req: Request, next: NextFunction) => {

    try {
        const getVideo = await Video.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            { $unwind: "$userDetails" },
            { $project: { "userDetails.password": 0, "userId": 0 } },
            { $match: { "likedBy": new mongoose.Types.ObjectId(req.body.user._id) } },
            { $sort: { createdAt: -1 } },

        ]);

        return getVideo;

    } catch (error) {
        throw next(error);
    }

}

export const getViewVideos = async (req: Request, next: NextFunction) => {
    const { user } = req.body
    if (user.history.length === 0) throw new Error("No history found")
    try {
        const getVideos = await User.aggregate([
            { $match: { _id: user._id } },
            { $unwind: '$history' },
            {
                $lookup: {
                    from: 'videos',
                    localField: 'history.videoId',
                    foreignField: '_id',
                    as: 'video'
                }
            },
            { $unwind: '$video' },
            { $sort: { 'history.date': -1 } },

            { $project: { "video": 1, } },
        ]);
        if (getVideos.length === 0) throw new Error("No history found")
        const result = await Promise.all(getVideos.map(async (item) => {
            const userDetails = await User.findById(item.video.userId)
            return {
                ...item.video,
                userDetails: {
                    username: userDetails?.username,
                    img: userDetails?.img,
                }
            }
        }))

        return result;

    }

    catch (error) {
        throw next(error);
    }

}


export const getRecommendedVideos = async (req: Request, next: NextFunction) => {
    const { id } = req.params

    try {
        const getVideoDetails = await Video.findById(id)
        if (!getVideoDetails) throw new Error("No video found")
        const getTags = getVideoDetails.tags

        const getVideo = await Video.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            { $unwind: "$userDetails" },
            { $project: { "userDetails.password": 0, "userId": 0 } },
            { $match: { "tags": { $in: getTags } } },
            { $sort: { createdAt: -1 } },

        ]);
        //remove the current video
        const result = getVideo.filter((item) => item._id.toString() !== id)

        return result;


    }
    catch (error) {
        throw next(error);
    }

}

export const getLikedVideosIds = async (req: Request, next: NextFunction) => {
    const { videoId } = req.params

    try {
        const getVideo = await Video.findById(videoId)
        const videoIds: string[] = []
        if (getVideo) {
            getVideo.likedBy.map((item) => {
                videoIds.push(item.toString())
            })
        }
        return videoIds;

    } catch (error) {
        throw next(error);
    }

}

export const getdisLikedVideosIds = async (req: Request, next: NextFunction) => {
    const { videoId } = req.params

    try {
        const getVideo = await Video.findById(videoId)
        const videoIds: string[] = []
        if (getVideo) {
            getVideo.dislikedBy.map((item) => {
                videoIds.push(item.toString())
            })
        }
        return videoIds;

    } catch (error) {
        throw next(error);
    }

}

export const getVideoSubscritionIds = async (req: Request, next: NextFunction) => {
    const { videoId } = req.params

    try {
        const getVideo = await Video.findById(videoId)
        if (getVideo) {
            const getUserSubscriptions = await User.findById(getVideo.userId)
            if (getUserSubscriptions) {


                const subcriptionIds: string[] = []
                getUserSubscriptions.subscripersId.map((item) => {
                    subcriptionIds.push(item.toString())
                })
                return subcriptionIds;
            }


        }
        else {
            throw new Error("No video found")
        }



    } catch (error) {
        throw next(error);
    }

}










