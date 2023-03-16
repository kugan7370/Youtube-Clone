import userRouter from './user_route';
import  Express  from 'express';

const app=Express();

app.use('/user',userRouter);


export default app;
