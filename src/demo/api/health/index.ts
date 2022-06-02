import Router from 'koa-router';
import healthCheck from './health-check';

const router = new Router({
  prefix: '/health',
});

router.get('/', healthCheck);

export default router;
