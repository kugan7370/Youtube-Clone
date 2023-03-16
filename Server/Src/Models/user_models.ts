import mongoose from "mongoose";

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
    },
    subscripers:{
        type: Number,
        default: 0
    },
    subscribtions:{
        type: [String]
    }

},
    { timestamps: true }

);

//create user model
const User = mongoose.model("User", userSchema);

export default User;

