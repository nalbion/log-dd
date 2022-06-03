import './index';
import logCapture from '../log-capture';
import helloWorld from '../test/hello-world';

describe('jest-log', () => {
  beforeAll(() => logCapture.start());
  afterEach(() => logCapture.reset());
  afterAll(() => logCapture.stop());

  describe('console', () => {
    test('match snapshot', () => {
      helloWorld();
      expect(logCapture).console();
    });

    test('match string', () => {
      helloWorld();
      expect(logCapture).console('INFO:  Hello World!');
    });
  });

  describe('console.info', () => {
    test('match snapshot', () => {
      helloWorld();
      expect(logCapture).console_info();
    });

    test('match string', () => {
      helloWorld();
      expect(logCapture).console_info('Hello World!');
    });

    test('match multiple lines', () => {
      helloWorld();
      console.debug('debug');
      console.error('expected error');
      expect(logCapture).console_info(
        `Hello World!
expected error`
      );
    });
  });
});

// export {}
