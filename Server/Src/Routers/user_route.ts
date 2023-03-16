import Express from "express";
import { deleteUserHandler, getAllUserHandler, getUserByIdHandler, loginUserHandler, registerUserHandler, updateUserHandler } from "../Controllers/user_controller";
import { varifyUser } from "../Middleware/VarifyUser";


const router = Express.Router();

//create user
router.post("/register", registerUserHandler);

//login user
router.post("/login", loginUserHandler);

//get all users
router.get("/getAllUser", getAllUserHandler);

//get user by id
router.get("/getById/:id", getUserByIdHandler);

//update user
router.put("/update/:id", varifyUser, updateUserHandler);

//delete user
router.delete("/delete", varifyUser, deleteUserHandler);







export default router;