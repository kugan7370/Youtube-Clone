import { NextFunction, Request } from "express";
import { UserInputs, userResponse, userUpdateProps } from "../@types/user_type";
import User from "../Models/user_models";
import bcrypt from "bcrypt";
import createError from "../Utils/createError";
import jwt from "jsonwebtoken";
import env from "../Utils/env-valid";
import mongoose from "mongoose";
import Video from "../Models/video_models";


export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

export const createUser = async (userData: UserInputs, next: NextFunction) => {
  const { username, email, password } = userData;

  if (!username) return next(createError(400, "Username is required"));
  if (!email) return next(createError(400, "Email is required"));
  if (!password) return next(createError(400, "Password is required"));

  try {
    const checkByEmail = await User.findOne({ email });
    const checkByUsername = await User.findOne({ username });

    if (checkByEmail || checkByUsername) return next(createError(400, "User already exists"));

    const hashedPassword = await hashPassword(userData.password);
    const user = new User({ ...userData, password: hashedPassword });

    const savedUser = await user.save();
    return savedUser;
  } catch (error) {
    throw next(error);
  }
};

export const loginUsers = async (userData: UserInputs, next: NextFunction) => {
  const { email, password } = userData;
  if (!email) return next(createError(400, "Email is required"));
  if (!password) return next(createError(400, "Password is required"));

  try {
    const isUser = await User.findOne({ email }).populate("subscribtions")
    if (!isUser) {
      return next(createError(400, "user not found"));
    }

    const isPasswordMatch = await bcrypt.compare(password, isUser.password);
    if (!isPasswordMatch) {
      return next(createError(400, "Invalid credentials"));
    }

    const token = jwt.sign({ id: isUser._id }, env.JWT_SECRET, {
      expiresIn: env.JWT_SECRET_EXPIRES_IN,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: userPassword, ...user } = isUser.toObject();


    return { user, token };
  }
  catch (error) {
    throw next(error);
  }
}

export const updateUser = async (id: string, userData: userUpdateProps, next: NextFunction) => {

  try {

    if (id != userData.user._id) return next(createError(400, "own user update his your profile"));

    if (userData.password) {
      const hashedPassword = await hashPassword(userData.password);
      userData.password = hashedPassword;
    }
    const updatedUser = await User.findByIdAndUpdate({ _id: userData.user._id }, userData, { new: true }).select("-password");
    if (updatedUser) {
      return updatedUser;
    }


  } catch (error) {
    throw next(error);
  }
}

export const deleteUser = async (userData: userUpdateProps, next: NextFunction) => {
  try {
    const deletedUser = await User.findByIdAndDelete({ _id: userData.user._id });
    return deletedUser;
  } catch (error) {
    throw next(error);
  }
}

export const getUsers = async (next: NextFunction) => {
  try {
    const user = await User.find().select("-password");

    if (user) return user;

  } catch (error) {
    throw next(error);
  }
}

export const getUserById = async (id: string, next: NextFunction) => {
  try {
    const user = await User.find({ _id: id }).select("-password");
    if (user) {
      return user;
    }
  } catch (error) {
    throw next(error);
  }

}

export const subscribtions = async (id: string, userDetails: userResponse, next: NextFunction) => {
  try {
    const user = await User.findById(userDetails._id);
    const userSubscripers = await User.findById(id);

    let message = ''
    if (user && userSubscripers) {
      if (user.subscribtions) {
        if (user.subscribtions.includes(id) && userSubscripers.subscripers > 0) {
          user.subscribtions = user.subscribtions.filter((item) => item != id);
          await user.save();


          userSubscripers.subscripers = userSubscripers.subscripers - 1;
          await userSubscripers.save();

          message = 'unsubscribed successfully';
        }
        else {
          user.subscribtions.push(id);
          await user.save();

          userSubscripers.subscripers = userSubscripers.subscripers + 1;
          await userSubscripers.save();

          message = 'subscribed successfully';
        }

        return message;
      }

    }


  } catch (error) {
    throw next(error);

  }

}

export const addVideoToHistory = async (req: Request, videoId: string, next: NextFunction) => {
  const { user: users } = req.body;

  try {
    const user = await User.findById(users._id);
    if (user) {
      if (user.history.some((item) => item.videoId == videoId)) {
        user.history = user.history.map((item) => {
          if (item.videoId == videoId) {
            item.date = new Date();
          }
          return item;
        })
      }
      else {
        user.history.push({ videoId, date: new Date() });

      }
      await user.save();

      return user;
    }
  } catch (error) {
    throw next(error);
  }
}






