import combineRouters from 'koa-combine-routers';
import healthRouter from './health';

const router = combineRouters(healthRouter);

export default router;
