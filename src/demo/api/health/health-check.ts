import { Context } from 'koa';
import fs from "fs";
import path from "path";
const pkg = JSON.parse(fs.readFileSync(path.resolve('package.json'), 'utf8'));

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
