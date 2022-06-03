import logCapture from './log-capture';

/**
 * @see https://mochajs.org/#root-hook-plugins
 * If you're using `mocha --watch` you will need to add
 *
 * before(() => logCapture.start());
 * afterEach(() => logCapture.reset());
 * after(() => logCapture.stop());
 *
 */
export const mochaHooks = {
  before() {
    logCapture.start();
  },
  afterEach(this: Mocha.Context) {
    if (this.currentTest && this.currentTest.state !== 'passed') {
      logCapture.log();
    }

    logCapture.reset();
  },
  after() {
    logCapture.stop();
  },
};
