import { Document } from "mongoose";


export interface userResponse {
    _id: string;
    email: string;
    username: string;
    img: string;
    subscripers: number;
    subscribtions: string[];
    createdAt: string;

}


export interface userUpdateProps extends UserInputs {
    user: userResponse;
}


export interface UserInputs extends Document {
    email: string;
    username: string;
    password: string;
    img?: string;
    subscripers: number;
    subscribtions: string[];

}

