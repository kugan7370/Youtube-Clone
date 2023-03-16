import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import {  saveUser } from "../Services/user_service";
import createError from "../Utils/createError";
import bcrypt from "bcrypt";
import env from "../Utils/env-valid";
import User from "../Models/user_models";

export const registerUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { username, email, password } = req.body;
    if (!username) return next(createError(400, "Username is required"));
    if (!email) return next(createError(400, "Email is required"));
    if (!password) return next(createError(400, "Password is required"));

    try {
        const checkByEmail=await User.findOne({email})
        const checkByUsername=await User.findOne({username})

        if(checkByEmail || checkByUsername) return next(createError(400, "User already exists"));
        
         await saveUser(req.body, next);

        return res
            .status(201)
            .json({ message: "User created successfully"});
    } catch (error) {
        return next(error);
    }
};

export const loginUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { email, password } = req.body;
    if (!email) return next(createError(400, "Email is required"));
    if (!password) return next(createError(400, "Password is required"));

   try {
    const isUser = await User.findOne({ email })
    if (!isUser) {
      return next(createError(400, "Invalid credentials"));
    }

    const isPasswordMatch = await bcrypt.compare(password, isUser.password);
    if (!isPasswordMatch) {
      return next(createError(400, "Invalid credentials"));
    }

    const token = jwt.sign({ id: isUser._id }, env.JWT_SECRET, {
      expiresIn: env.JWT_SECRET_EXPIRES_IN,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const  {password:userPassword,...user}=isUser.toObject();

//save cookies

return res.cookie("access_token", token, {
  expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
  httpOnly: true,
})
.json({ success: true, message: "Login success", user: user, token });

  } catch (error) {
    return next(error);
  }

       

}
