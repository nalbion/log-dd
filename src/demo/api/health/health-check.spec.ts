import { expect } from 'chai';
import { Context } from 'koa';
import healthCheck from './health-check';

const mockCtx = {} as Context;

describe('Route - healthCheck', () => {
  it('should include version ', async () => {
    await healthCheck(mockCtx);
    expect(mockCtx.body).to.have.property('version');
  });
});
