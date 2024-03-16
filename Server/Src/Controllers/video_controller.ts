import { NextFunction, Request, Response } from "express";
import { addVideo, deleteVideo, disLikedVideo, getAllVideo, getdisLikedVideosIds, getLikedVideos, getLikedVideosIds, getRandomVideos, getRecommendedVideos, getSearchVideos, getSubscriptionVideos, getTrendingVideos, getVideoByUser, getVideoSubscritionIds, getViewVideos, likedVideo, updateVideo, viewVideo } from "../Services/video_service";

export const addVideoHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const video = await addVideo(req, next);
        if (video) {
            return res.status(201).json({ message: "Video added successfully", video })
        }
    } catch (error) {
        return next(error);
    }

}

export const getAllVideoHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let video;
        if (req.query.search) {
            video = await getSearchVideos(req, next);
        }
        else {

         video = await getAllVideo(req, next);
        }
        if (video) {
            return res.status(201).json({ video })
        }
    } catch (error) {
        return next(error);
    }

}
export const getVideoByIdHandler = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const video = await getAllVideo(req, next, true);
        if (video) {
            return res.status(201).json({ video })
        }
    } catch (error) {
        return next(error);
    }

}


export const updateVideoHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
        const video = await updateVideo(id, req.body, next);
        if (video) {
            return res.status(201).json({ message: "Video updated successfully", video })
        }
    } catch (error) {
        return next(error);
    }

}

export const deleteVideoHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const video = await deleteVideo(id, next);
        if (video) {
            return res.status(201).json({ message: "Video deleted successfully" })
        }
    } catch (error) {
        return next(error);
    }

}

export const likeVideoHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
        const video = await likedVideo(id, req.body, next);
        if (video) {
            return res.status(201).json({ message: video.message })
        }

    } catch (error) {
        return next(error);
    }
}
export const disLikeVideoHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
        const video = await disLikedVideo(id, req.body, next);
        if (video) {
            return res.status(201).json({ message: video.message })
        }

    } catch (error) {
        return next(error);
    }
}

export const viewVideoHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const video = await viewVideo(id, next);
        if (video) {
            return res.status(201).json({ message: "Video viewed successfully" })
        }
    } catch (error) {
        return next(error);
    }

}

export const getTrendingVideoHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const video = await getTrendingVideos(next);
        if (video) {
            return res.status(201).json({ video })
        }
    } catch (error) {
        return next(error);
    }

}
export const getRandomVideoHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const video = await getRandomVideos(next);
        if (video) {
            return res.status(201).json({ video })
        }
    } catch (error) {
        return next(error);
    }

}

export const getSubscriptionVideoHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const video = await getSubscriptionVideos(req, next);
        if (video) {
            return res.status(201).json({ video })
        }
    } catch (error) {
        return next(error);
    }

}

export const getSearchVideoHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const video = await getSearchVideos(req, next);
        if (video) {
            return res.status(201).json({ video })
        }
    } catch (error) {
        return next(error);
    }

}

export const getVideoByUserHandler = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const video = await getVideoByUser(req, next);
        if (video) {
            return res.status(201).json({ video })
        }
    } catch (error) {
        return next(error);
    }

}

export const getLikedVideoHandler = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const video = await getLikedVideos(req, next,);
        if (video) {
            return res.status(201).json({ video })
        }
    } catch (error) {
        return next(error);
    }

}

export const getViewedVideoHandler = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const video = await getViewVideos(req, next);
        if (video) {
            return res.status(201).json({ video })
        }
    } catch (error) {
        return next(error);
    }

}

export const getRecommendedVideoHandler = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const video = await getRecommendedVideos(req, next);
        if (video) {
            return res.status(201).json({ video })
        }
    } catch (error) {
        return next(error);
    }

}

export const getLikedVideoIdHandler = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const video = await getLikedVideosIds(req, next);
        if (video) {
            return res.status(201).json({ video })
        }
    } catch (error) {
        return next(error);
    }

}
export const getDislikedVideoIdHandler = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const video = await getdisLikedVideosIds(req, next);
        if (video) {
            return res.status(201).json({ video })
        }
    } catch (error) {
        return next(error);
    }

}
export const getSubscribtionIdsHandler = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const video = await getVideoSubscritionIds(req, next);
        if (video) {
            return res.status(201).json({ video })
        }
    } catch (error) {
        return next(error);
    }

}






