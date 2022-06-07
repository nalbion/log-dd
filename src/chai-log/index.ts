import './chai-log';
import ChaiStatic = Chai.ChaiStatic;
import ChaiUtils = Chai.ChaiUtils;
import logCapture, { LOG_LEVELS, LogLevel } from '../log-capture';

export default function chaiLog(chai: ChaiStatic, utils: ChaiUtils) {
  const Assertion = chai.Assertion;

  const chainConsole = function (this: Chai.Assertion) {
    const target = utils.flag(this, 'object');

    utils.flag(this, 'console', true);

    if (typeof target == 'function') {
      target();
    }
  };

  const assertLogs = (level: LogLevel) =>
    function (this: Chai.Assertion, args: string | string[]) {
      const expected = Array.isArray(args) ? args : args.split('\n');
      const actual = utils.flag(this, 'object');
      // const actual = logCapture.get(level === 'log' ? undefined : level);

      new Assertion(actual).to.have.ordered.members(expected);
    };

  const chainLogs = function (level: LogLevel) {
    return function (this: Chai.Assertion) {
      utils.flag(this, 'object', logCapture.get(level === 'log' ? undefined : level));
    };
  };

  utils.addProperty(Assertion.prototype, 'console', chainConsole);
  // utils.addChainableMethod(Assertion.prototype, 'console', assertConsole, chainConsole);
  LOG_LEVELS.forEach((level) => {
    utils.addChainableMethod(Assertion.prototype, level, assertLogs(level as LogLevel), chainLogs(level as LogLevel));
    // utils.addMethod(Assertion.prototype, level, assertLogs(level as LogLevel));
  });
}
