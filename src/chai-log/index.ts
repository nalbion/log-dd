/// <reference types="./index" />
import ChaiStatic = Chai.ChaiStatic;
import ChaiUtils = Chai.ChaiUtils;
import logCapture, { LOG_LEVELS, LogLevel } from '../log-capture';

// let _overwriteMethod: (methodName: string, method: (this: Chai.AssertionStatic, ...args: any[]) => any) => void;
// let _chai: ChaiStatic;
// let _utils: ChaiUtils;

/* * adapted from chaiAsPromised * /
export const reconfigureChaiLog = () => {
  function getBasePromise(assertion: any) {
    return typeof assertion.then === 'function' ? assertion : assertion._obj;
  }

  function doAsserterAsyncAndAddThen(asserter: Chai.AssertStatic, assertion: any, args: any) {
    if (!_utils.flag(assertion, 'eventually')) {
      asserter.apply(assertion, args);
      return assertion;
    }

    const derivedPromise = getBasePromise(assertion)
      .then((value: any) => {
        assertion._obj = value;
        _utils.flag(assertion, 'eventually', false);

        return args ? transformAsserterArgs(args) : args;
      })
      .then((newArgs: any) => {
        // console.info('doAsserterAsyncAndAddThen:', newArgs, assertion._obj);
        asserter.apply(assertion, newArgs);

        return assertion._obj;
      });

    transferPromiseness(assertion, derivedPromise);
    return assertion;
  }

  LOG_LEVELS.forEach((methodName) => {
    // _chai.Assertion.
    _chai.Assertion.overwriteMethod(
      methodName,
      (originalMethod) =>
        function (this: Chai.Assertion, args: any[]) {
          // console.info('overwriteMethod----', methodName, ...args);
          return doAsserterAsyncAndAddThen(originalMethod, this, args);
        }
    );
  });
};
*/

export default function chaiLog(chai: ChaiStatic, utils: ChaiUtils) {
  // _chai = chai;
  // _utils = utils;

  const Assertion = chai.Assertion;

  // if (!_overwriteMethod) {
  //   _overwriteMethod = Assertion.overwriteMethod;
  //   Assertion.overwriteMethod = (methodName: string, originalMethod: (this: Chai.AssertionStatic, ...args: any[]) => any) {
  //     _overwrittenMethods[methodName] =
  //     _overwriteMethod(methodName, originalMethod);
  //   }
  // }

  // const assertConsole = function (this: Chai.Assertion) {};

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
      // const actual = utils.flag(this, 'object');
      const actual = logCapture.get(level === 'log' ? undefined : level);
      // console.info('assertLogs:', actual.length, actual);
      // console.info('expected:', expected);

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
