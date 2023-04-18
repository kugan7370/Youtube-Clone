import Express from "express";
import { varifyUser } from "../Middleware/VarifyUser";
import * as commentController from "../Controllers/comment_controller";

const router = Express.Router();



//add comment 
router.post("/addComment", varifyUser, commentController.addCommentHandler);

//get all comments
router.get("/getComment", varifyUser, commentController.getCommentHandler);

//get comment by video id
router.get("/getCommentByVideoId/:videoId", varifyUser, commentController.getCommentByVideoIdHandler);

//delete user
router.delete("/deleteComment/:id", varifyUser, commentController.deleteCommentHandler);


export default router;

