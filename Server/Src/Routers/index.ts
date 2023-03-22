import Express from 'express';
const app = Express();

import userRouter from './user_route';
import videoRouter from './video_routes';
import commentRouter from './comment_route';


app.use('/user', userRouter);
app.use('/video', videoRouter);
app.use('/comment', commentRouter);



export default app;
