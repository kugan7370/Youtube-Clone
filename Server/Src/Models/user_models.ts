import mongoose from "mongoose";
import { UserInputs } from "../@types/user_type";

//create user schmea
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,

    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 255,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        min: 8,
        max: 20
    },
    img: {
        type: String,
        default: "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-High-Quality-Image.png"
    },
    subscripers: {
        type: Number,
        default: 0
    },
    subscripersId: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
    },
    subscribtions: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",

    },
    history: [
        {
            videoId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Video"
            },
            date: {
                type: Date,
                default: Date.now

            }
        }

    ]

},
    { timestamps: true }

);

//create user model
const User = mongoose.model<UserInputs>("User", userSchema);

export default User;

