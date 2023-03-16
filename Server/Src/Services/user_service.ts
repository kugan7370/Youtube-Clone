import { NextFunction } from "express";
import { userParamProps, userProps, userUpdateProps } from "../@types/user_type";
import User from "../Models/user_models";
import bcrypt from "bcrypt";
import createError from "../Utils/createError";
import jwt from "jsonwebtoken";
import env from "../Utils/env-valid";


export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

export const createUser = async (userData: userProps, next: NextFunction) => {
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

export const loginUsers = async (userData: userProps, next: NextFunction) => {
  const { email, password } = userData;
  if (!email) return next(createError(400, "Email is required"));
  if (!password) return next(createError(400, "Password is required"));

  try {
    const isUser = await User.findOne({ email })
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

    if (id !== userData.userId) return next(createError(400, "own user update his your profile"));

    if (userData.password) {
      const hashedPassword = await hashPassword(userData.password);
      userData.password = hashedPassword;
    }
    const updatedUser = await User.findByIdAndUpdate({ _id: userData.userId }, userData, { new: true });
    return updatedUser;
  } catch (error) {
    throw next(error);
  }
}

export const deleteUser = async (userData: userUpdateProps, next: NextFunction) => {
  try {
    const deletedUser = await User.findByIdAndDelete({ _id: userData.userId });
    return deletedUser;
  } catch (error) {
    throw next(error);
  }
}

export const getUsers = async (next: NextFunction) => {
  try {
    const user = await User.find();
    if (user) {
      const usersWithoutPassword = await Promise.all(user.map((user) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...rest } = user.toObject();
        return rest;
      }));
      return usersWithoutPassword;
    }
  } catch (error) {
    throw next(error);
  }
}

export const getUserById = async (id: string, next: NextFunction) => {
  try {
    const user = await User.find({ _id: id });
    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = user[0].toObject();
      return rest;
    }
  } catch (error) {
    throw next(error);
  }

}


