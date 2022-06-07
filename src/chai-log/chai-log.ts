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

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace Chai {
  export interface Assertion {
    console: ConsoleAssertion;
    // log(expected: string): void;
  }

  export interface PromisedAssertion {
    console: ConsoleAssertion;
  }
}
