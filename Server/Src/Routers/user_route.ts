import Express from "express";
import { loginUser, registerUser } from "../Controllers/user_controller";


const router = Express.Router();

//create user
router.post("/register",registerUser);
router.post("/login",loginUser);





export default router;