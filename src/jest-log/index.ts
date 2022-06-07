/// <reference types="./jest-log" />
// import { toMatchSnapshot } from 'jest-snapshot';
import logCapture, { LOG_LEVELS, LogLevel } from '../log-capture';

const createMatcher = (level?: LogLevel) => {
  return async function (this: jest.MatcherContext, received: any, expected?: string | string[]) {
    const actual = logCapture.get(level === 'log' ? undefined : level);

    if (!expected) {
      const { toMatchSnapshot } = await import('jest-snapshot');
      // eslint-disable-next-line @typescript-eslint/ban-types
      return (toMatchSnapshot as Function).call(this, actual.join('\n'), level || 'all');
    }

    if (!Array.isArray(expected)) {
      expected = expected.split('\n');
    }

    const equal = this.equals(expected, actual);

    return {
      pass: equal,
      message: () =>
        equal
          ? `Was not expecting console ${level} to be equal`
          : this.utils.printDiffOrStringify(expected, actual, 'expected', 'logged', this.expand),
    };
  };
};

const jestLog: jest.ExpectExtendMap = {
  console: createMatcher(),
};

LOG_LEVELS.forEach((level) => {
  jestLog[`console_${level}`] = createMatcher(level as LogLevel);
});

export default jestLog;
