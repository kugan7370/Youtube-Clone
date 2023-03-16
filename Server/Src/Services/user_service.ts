import { NextFunction } from 'express';
import { userProps } from '../@types/user_type';
import User from '../Models/user_models';
import bcrypt from 'bcrypt';


export const saveUser = async (userData: userProps, next: NextFunction) => {
    try {

        const hashedPassword = await hashPassword(userData.password);
        const user = new User({ ...userData, password: hashedPassword });

        const savedUser = await user.save();
        return savedUser;
    } catch (error) {
        throw next(error);
    }
}

export const hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}


