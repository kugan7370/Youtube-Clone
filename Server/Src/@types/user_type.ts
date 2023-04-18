import { Document } from "mongoose";


export interface userResponse {
    _id: string;
    email: string;
    username: string;
    img: string;
    subscripers: number;
    subscribtions: string[];
    subscripersId: string[];
    history: History[];
    createdAt: string;


}


export interface userUpdateProps extends UserInputs {
    user: userResponse;
}


export interface UserInputs extends Document {
    email: string;
    username: string;
    password: string;
    img: string;
    history: History[];
    subscripers: number;
    subscribtions: string[];
    subscripersId: string[];


}

export interface History {
    videoId: string;
    date: Date;
}


