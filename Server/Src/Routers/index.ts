import userRouter from './user_route';
import videoRouter from './video_routes';
import Express from 'express';

const app = Express();

app.use('/user', userRouter);
app.use('/video', videoRouter);


export default app;
