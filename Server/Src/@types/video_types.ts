import { userResponse } from "./user_type";

export interface videoProps {
    title: string;
    description: string;
    video: string;
    thumbnail: string;
    username: string;
    category: string;
    tags: string[];

}
export interface addVideoProps extends videoProps {
    user: userResponse;
}

export interface videoResponse extends videoProps {
    _id: string;
    createdAt: string;
    userDetails: userResponse;
}


export interface videoUpdateProps extends videoProps {
    user: userResponse;

}



