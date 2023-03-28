import { NextFunction, Request, Response } from "express";
import { createUser, deleteUser, getUserById, getUsers, loginUsers, subscribtions, updateUser, } from "../Services/user_service";


export const registerUserHandler = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const registerUser = await createUser(req.body, next);
    if (registerUser) {
      return res
        .status(201)
        .json({ message: "User created successfully" });
    }

  } catch (error) {
    return next(error);
  }
};

export const loginUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData = await loginUsers(req.body, next);

    if (userData) {
      return res.cookie("access_token", userData.token, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        httpOnly: true,
      }).json({ success: true, message: "Login success", user: userData.user, token: userData.token });

    }


  } catch (error) {
    return next(error)
  }

}


export const updateUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  try {
    const updatedUser = await updateUser(id, req.body, next);
    if (updatedUser) {
      return res
        .status(201)
        .json({ message: "User updated successfully", user: updatedUser });
    }

  } catch (error) {
    return next(error)
  }

}

export const deleteUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deletedUser = await deleteUser(req.body, next);
    if (deletedUser) {
      return res
        .status(201)
        .json({ message: "User deleted successfully" });
    }

  } catch (error) {
    return next(error)
  }

}

export const getAllUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await getUsers(next);
    if (user) {
      return res
        .status(201)
        .json({ user });
    }


  } catch (error) {
    return next(error);
  }
}

export const getUserByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params

  try {
    const user = await getUserById(id, next);
    if (user) {
      return res
        .status(201)
        .json({ user });
    }
  }
  catch (error) {
    return next(error);
  }
}

export const subscribeUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const { user } = req.body
  try {
    const message = await subscribtions(id, user, next);
    if (message) {
      return res
        .status(201)
        .json({ message });
    }

  } catch (error) {
    return next(error);

  }
}

export const logoutUserHandler = async (req: Request, res: Response) => {
  res.clearCookie("access_token");
  return res.json({ success: true, message: "Logout success" });
}