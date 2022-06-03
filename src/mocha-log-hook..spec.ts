import { expect, should as _should } from 'chai';
import sinon, { SinonSpy } from 'sinon';
import logCapture from './log-capture';
import { mochaHooks } from './mocha-log-hooks';

_should();

describe('mocha-log-hooks', () => {
  let log: SinonSpy<any[], any>;

  beforeEach(() => {
    log = sinon.fake();
    sinon.replace(logCapture, 'log', log);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should show logs for failed tests', () => {
    // Given logCapture is active
    logCapture.start();
    // When
    console.error('testing failure');
    mochaHooks.afterEach.call({ currentTest: { state: 'failed' } } as Mocha.Context);
    // Then
    log.calledOnce.should.be.true;
  });

  it('should not show logs for passed tests', () => {
    // Given logCapture is active
    logCapture.start();
    // When
    console.info('test successful');
    mochaHooks.afterEach.call({ currentTest: { state: 'passed' } } as Mocha.Context);
    // Then
    log.calledOnce.should.be.false;
  });

  it('should not show logs when currentTest not provided', () => {
    // Given logCapture is active
    logCapture.start();
    // When
    console.info('test successful');
    mochaHooks.afterEach.call({} as Mocha.Context);
    // Then
    log.calledOnce.should.be.false;
  });
});
