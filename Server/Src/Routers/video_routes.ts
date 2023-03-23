import Express from "express";
import { varifyUser } from "../Middleware/VarifyUser";
import * as videoController from "../Controllers/video_controller";


const router = Express.Router();

//create video
router.post("/add", varifyUser, videoController.addVideoHandler);

//get all videos
router.get("/get-all", videoController.getAllVideoHandler);

//get video by user
router.get("/get-user/:id", videoController.getVideoByUserHandler);

//update user
router.put("/update/:id", varifyUser, videoController.updateVideoHandler);

//delete user
router.delete("/delete/:id", varifyUser, videoController.deleteVideoHandler);

//like video
router.put("/like/:id", varifyUser, videoController.likeVideoHandler);

// view video
router.put("/view/:id", varifyUser, videoController.viewVideoHandler);

//get trending video
router.get("/trending", videoController.getTrendingVideoHandler);

// get random video
router.get("/random", videoController.getRandomVideoHandler);

//get user subcriptoin video
router.get("/subscription", varifyUser, videoController.getSubscriptionVideoHandler);










export default router;