import mongoose from "mongoose"
import env from "../Utils/env-valid"

const db_connect=()=>{
    mongoose.connect(env.Mongo_Connect,{
       
    })
    .then(()=>console.log("MongoDB Connected"))
    .catch((err)=>console.log(err))


}

export default db_connect