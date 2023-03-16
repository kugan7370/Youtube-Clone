export interface userProps {
    email: string;
    username: string;
    password: string;
    img?: string;
    subscripers?: number;
    subscribtions?: string[];
}

export interface userResponse extends userProps {
    _id: string;
    createdAt: string;
}

