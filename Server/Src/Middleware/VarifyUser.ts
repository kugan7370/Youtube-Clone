//varify user using cookie
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import createError from "../Utils/createError";
import envValid from "../Utils/env-valid";


export const varifyUser = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.access_token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, envValid.JWT_SECRET) as JwtPayload;
        req.body.userId = decoded.id;


        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            next(createError(401, "Invalid token"));
        } else {
            next(error);
        }
    }
}