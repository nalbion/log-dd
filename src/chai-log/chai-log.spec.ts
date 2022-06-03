import chai, { expect } from 'chai';
import chaiLog from './index';
import logCapture from '../log-capture';
import helloWorld from '../test/hello-world';

chai.use(chaiLog);

// These lines can be removed if you do not run `mocha --watch`
// Given
before(() => logCapture.start());
afterEach(() => logCapture.reset());
after(() => logCapture.stop());

describe('chai-log', () => {
  describe('chained console', () => {
    it('formats log messages', () => {
      // When
      console.info(`%d Hello %s!`, 123, 'World');
      // Then
      expect(logCapture).to.console.info('123 Hello World!');
    });

    it('asserts log', () => {
      // When
      console.debug('debug');
      helloWorld();
      helloWorld('yourself');
      console.error('expected error');
      // Then
      expect(logCapture).to.console.log(
        `DEBUG: debug
INFO:  Hello World!
INFO:  Hello yourself!
ERROR: expected error`
      );
    });

    it('asserts info', () => {
      // When
      console.debug('debug');
      helloWorld();
      helloWorld('yourself');
      console.error('expected error');
      // Then
      expect(logCapture).to.console.info(['Hello World!', 'Hello yourself!', 'expected error']);
    });

    it('asserts error', () => {
      // When
      helloWorld();
      console.error('expected error');
      // Then
      expect(logCapture).to.console.error('expected error');
    });

    it('chained log includes all', () => {
      // When
      console.debug('debug');
      helloWorld();
      // Then
      expect(logCapture)
        .that.console.log //
        .includes('INFO:  Hello World!')
        .and.includes('DEBUG: debug');
    });

    it('chained info', () => {
      // When
      console.debug('debug');
      helloWorld();
      // Then
      expect(logCapture)
        .that.console.info //
        .includes('Hello World!')
        .but.does.not.include('debug');
    });

    it('chained error', () => {
      // When
      helloWorld();
      console.error('expected error');
      // Then
      expect(logCapture)
        .that.console.error //
        .includes('expected error')
        .but.does.not.include('Hello World!');
    });
  });

  it('executes expectation', () => {
    expect(() => {
      // When
      helloWorld();
    }) // Then
      .to.console.info('Hello World!');
  });

  it('works with promise', async () => {
    // reconfigureChaiLog();
    const asyncTask = new Promise((resolve, reject) => {
      setTimeout(() => {
        // When
        helloWorld();
        resolve({});
      }, 10);
    });

    // Then
    expect((await asyncTask) as any).to.console.info('Hello World!');
    // chai-as-promised breaks `mocha --watch` by calling Assertion.overwriteMethod only once
    // await asyncTask.should.eventually.console.info('Hello World!');
  });
});
