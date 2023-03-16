import Express, { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import env from "./Utils/env-valid";
import DB_Connect from "./DB/index";
import router from "./Routers/index";
import { CustomError } from "./Utils/createError";
import handleMongooseError from "./Utils/mongoooseError";


const app = Express();



//middleware
app.use(Express.json());
app.use(cookieParser());


//routes
app.use("/api", router);



//mongoose error handler
app.use(handleMongooseError);

//error handling
app.use((err:CustomError, req:Request, res:Response, next:NextFunction) => {
    const statusCode = err.status || 500;
    const message = err.message || "Something went wrong";
   return res.status(statusCode).json({ status:false,message, statusCode, });
    
})

app.listen(env.PORT, () => {
    DB_Connect();
    console.log(`Server is running on port ${env.PORT}`);
}
);