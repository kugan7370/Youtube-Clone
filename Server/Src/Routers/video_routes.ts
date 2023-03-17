import Express from "express";
import { addVideoHandler, deleteVideoHandler, getAllVideoHandler, getVideoByUserHandler, likeVideoHandler, updateVideoHandler, viewVideoHandler } from "../Controllers/video_controller";
import { varifyUser } from "../Middleware/VarifyUser";


const router = Express.Router();

//create video
router.post("/add", varifyUser, addVideoHandler);

//get all videos
router.get("/get-all", getAllVideoHandler);

//get video by user
router.get("/get-user/:id", getVideoByUserHandler);

//update user
router.put("/update/:id", varifyUser, updateVideoHandler);

//delete user
router.delete("/delete/:id", varifyUser, deleteVideoHandler);

//like video
router.put("/like/:id", varifyUser, likeVideoHandler);

// view video
router.put("/view/:id", varifyUser, viewVideoHandler);









export default router;