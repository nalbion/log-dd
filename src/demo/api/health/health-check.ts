import { Context } from 'koa';
import pkg from '../../../../package.json';

const healthCheck = (ctx: Context) => {
  if (ctx.query?.version && ctx.query?.version !== pkg.version) {
    // Indicate to load balancer that this node should be removed from service
    ctx.status = 409;
  }

  ctx.body = {
    version: pkg.version,
    // TODO: disk space, DB connectivity, other dependencies...
  };
};

export default healthCheck;
