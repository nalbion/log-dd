import { expect, should as _should } from 'chai';
import logCapture from './log-capture';
import { mochaHooks } from './mocha-log-hooks';
import helloWorld from './test/hello-world';

_should();

describe('log-capture', () => {
  describe('start', () => {
    beforeEach(() => {
      if (logCapture.isCapturing()) {
        logCapture.stop();
        logCapture.reset();
      }
    });

    it('should not capture logs until started', () => {
      // Given not started
      console.debug('not started');
      // Then
      logCapture.get().should.be.empty;
    });

    it('should capture logs when started', () => {
      // Given not started
      console.debug('not started');
      // When
      logCapture.start();
      console.debug('testing start()');
      // Then
      logCapture.get().should.deep.equal(['DEBUG: testing start()']);
    });

    it('should stop logging', () => {
      // Given
      logCapture.start();
      console.debug('testing stop()...');
      // When
      logCapture.stop();
      console.info('stopped');
      // Then
      logCapture.get().should.deep.equal(['DEBUG: testing stop()...']);
    });

    it('should keep track of its capturing state', () => {
      // Given
      logCapture.isCapturing().should.be.false;
      // When
      logCapture.start();
      console.debug('testing isCapturing()');
      logCapture.start();
      // Then
      logCapture.isCapturing().should.be.true;
      logCapture.get().should.deep.equal(['DEBUG: testing isCapturing()']);
    });
  });

  describe('started', () => {
    // Given (These lines can be removed if you do not run `mocha --watch`)
    before(mochaHooks.before);
    afterEach(mochaHooks.afterEach);
    after(mochaHooks.after);

    it('formats log messages', () => {
      // When
      console.info(`%d Hello %s!`, 123, 'World');
      // Then
      logCapture.get('info').should.deep.equal(['123 Hello World!']);
    });

    it('get info logs', () => {
      // When
      console.debug('debug');
      helloWorld();
      // Then
      logCapture.get('info').should.deep.equal(['Hello World!']);
      logCapture.get('error').should.be.empty;
    });

    it('get all logs', () => {
      // When
      console.debug('debug');
      helloWorld();
      // Then
      logCapture.get('log').should.deep.equal(['debug', 'Hello World!']);
    });

    it('get all logs by default', () => {
      // When
      console.debug('debug');
      helloWorld();
      // Then
      logCapture.get().should.deep.equal(['DEBUG: debug', 'INFO:  Hello World!']);
    });

    it('output saved logs', () => {
      // Given
      console.info('testing log()');
      console.debug('...with debug');
      logCapture.get().should.deep.equal(['INFO:  testing log()', 'DEBUG: ...with debug']);
      // When still capturing
      logCapture.log('info').should.deep.equal(['testing log()']);
      logCapture.get().should.deep.equal(['INFO:  testing log()', 'DEBUG: ...with debug']);
      // When stopped
      logCapture.stop();
      logCapture.log('error').should.be.empty; // nothing logged at error
      logCapture.log().should.be.empty; // but logged to console, still not empty though...
      logCapture.get('debug').should.deep.equal(['testing log()', '...with debug']);
    });
  });
});
