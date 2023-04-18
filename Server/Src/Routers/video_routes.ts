import Express from "express";
import { varifyUser } from "../Middleware/VarifyUser";
import * as videoController from "../Controllers/video_controller";


const router = Express.Router();

//create video
router.post("/add", varifyUser, videoController.addVideoHandler);

//get all videos
router.get("/get-all", videoController.getAllVideoHandler);

// get video by id
router.get("/get/:videoId", videoController.getVideoByIdHandler);

//get video by user id
router.get("/yourVideos", varifyUser, videoController.getVideoByUserHandler);

//update video
router.put("/update/:id", varifyUser, videoController.updateVideoHandler);

//delete video
router.delete("/delete/:id", varifyUser, videoController.deleteVideoHandler);

//like video
router.put("/like/:id", varifyUser, videoController.likeVideoHandler);

//disLike video
router.put("/dislike/:id", varifyUser, videoController.disLikeVideoHandler);

// view video
router.put("/view/:id", varifyUser, videoController.viewVideoHandler);

//get trending video
router.get("/trending", videoController.getTrendingVideoHandler);

// get random video
router.get("/random", videoController.getRandomVideoHandler);

//get user subcriptoin video
router.get("/subscription", varifyUser, videoController.getSubscriptionVideoHandler);

//get search video
router.get("/search", videoController.getSearchVideoHandler);

//get liked video
router.get("/get-liked", varifyUser, videoController.getLikedVideoHandler);

//get viewed video
router.get("/get-viewed", varifyUser, videoController.getViewedVideoHandler);

//get recommended video
router.get("/get-recommended/:id", videoController.getRecommendedVideoHandler);

//get liked video Id
router.get("/get-liked-userId/:videoId", varifyUser, videoController.getLikedVideoIdHandler);

// get disliked video id
router.get("/get-disliked-userId/:videoId", varifyUser, videoController.getDislikedVideoIdHandler);

//get subscribtion ids of user
router.get("/get-subscribtion-ids/:videoId", varifyUser, videoController.getSubscribtionIdsHandler);










export default router;