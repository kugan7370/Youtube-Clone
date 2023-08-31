//upload video using multer
import multer from "multer";
import { Request } from "express";


const storage: multer.StorageEngine = multer.diskStorage({});

const fileFilter: any = (req: Request, file: any, cb: (err: any, accepted: boolean) => void) => {
    if (file.fieldname === "video") {
        if (file.mimetype === "video/mp4" || file.mimetype === "video/ogg" || file.mimetype === "video/webm") {
            cb(null, true);
        }
        else {

            cb(new Error("Only mp4, ogg, and webm format allowed"), false);
        }

    }
    if (file.fieldname === "thumbnail") {
        if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
            cb(null, true);
        }
        else {
            cb(new Error("Only jpeg and png format allowed"), false);
        }
    }



};



export const uploadVideo = multer({ storage, fileFilter });

