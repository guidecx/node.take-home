import express from 'express';
import setupMiddlewares from './middlewares';
import router from './routes';

const app = express();
setupMiddlewares(app);
app.use(router);

export default app;
