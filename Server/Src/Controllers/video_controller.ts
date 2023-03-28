import { NextFunction, Request, Response } from "express";
import { addVideo, deleteVideo, getAllVideo, getVideoByUser, likedVideo, updateVideo, viewVideo } from "../Services/video_service";

export const addVideoHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const video = await addVideo(req.body, next);
        if (video) {
            return res.status(201).json({ message: "Video added successfully", video })
        }
    } catch (error) {
        return next(error);
    }

}

export const getAllVideoHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const video = await getAllVideo(req, next);
        if (video) {
            return res.status(201).json({ video })
        }
    } catch (error) {
        return next(error);
    }

}
export const getVideoByIdHandler = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const video = await getAllVideo(req, next, false, false, false, false, true);
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
        const video = await getAllVideo(req, next, true);
        if (video) {
            return res.status(201).json({ video })
        }
    } catch (error) {
        return next(error);
    }

}
export const getRandomVideoHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const video = await getAllVideo(req, next, false, true);
        if (video) {
            return res.status(201).json({ video })
        }
    } catch (error) {
        return next(error);
    }

}

export const getSubscriptionVideoHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const video = await getAllVideo(req, next, false, false, true);
        if (video) {
            return res.status(201).json({ video })
        }
    } catch (error) {
        return next(error);
    }

}

export const getSearchVideoHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const video = await getAllVideo(req, next, false, false, false, true);
        if (video) {
            return res.status(201).json({ video })
        }
    } catch (error) {
        return next(error);
    }

}

export const getVideoByUserHandler = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const video = await getAllVideo(req, next, false, false, false, false, false, true);
        if (video) {
            return res.status(201).json({ video })
        }
    } catch (error) {
        return next(error);
    }

}


