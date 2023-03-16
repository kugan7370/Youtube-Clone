import Express from "express";
import cookieParser from "cookie-parser";
import env from "./Utils/env-valid";
import DB_Connect from "./DB/index";


const app = Express();



//middleware
app.use(Express.json());
app.use(cookieParser());


app.get("/", (req, res) => {
    res.send("Hello World!");
    }
);

app.listen(env.PORT, () => {
    DB_Connect();
    console.log(`Server is running on port ${env.PORT}`);
}
);