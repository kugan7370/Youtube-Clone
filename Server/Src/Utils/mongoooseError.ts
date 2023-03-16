import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

const handleValidationError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map((error: any) => error.message);
    return res.status(400).json({ success: false, errors });
  }
  next(err);
};

export default handleValidationError;