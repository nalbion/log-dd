/// <reference types="chai" />

type ConsoleAssertionMethod = ((expected: string | string[]) => Chai.Assertion) & Chai.Assertion;

interface ConsoleAssertion {
  trace: ConsoleAssertionMethod;
  debug: ConsoleAssertionMethod;
  info: ConsoleAssertionMethod;
  log: ConsoleAssertionMethod;
  warn: ConsoleAssertionMethod;
  error: ConsoleAssertionMethod;
}

// declare module 'chai-log' {
//   interface ChaiLog extends Chai.ChaiPlugin {
//   }
// }

declare namespace Chai {
  interface Assertion {
    console: ConsoleAssertion;
    // log(expected: string): void;
  }

  interface PromisedAssertion {
    console: ConsoleAssertion;
  }
}
