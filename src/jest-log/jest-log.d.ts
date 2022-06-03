/// <reference types="jest" />
import { LogCapture, LogLevel } from '../log-capture';

// type ConsoleMatcherMethod = (expected: string | string[]) => R;
//
// interface ConsoleMatcher<R> {
//   trace: ConsoleAssertionMethod<R>;
//   debug: ConsoleAssertionMethod<R>;
//   info: ConsoleAssertionMethod<R>;
//   log: ConsoleAssertionMethod<R>;
//   warn: ConsoleAssertionMethod<R>;
//   error: ConsoleAssertionMethod<R>;
// }

interface CustomMatchers<R = unknown> {
  // console<E = LogCapture>(expected: E): R;
  // console(level?: LogLevel, expected: string | string[]): R;

  console(expected?: string | string[]): R;
  console_trace(expected?: string | string[]): R;
  console_debug(expected?: string | string[]): R;
  console_info(expected?: string | string[]): R;
  console_log(expected?: string | string[]): R;
  console_warn(expected?: string | string[]): R;
  console_error(expected?: string | string[]): R;

  // info(expected: string | string[]): R;
}

declare global {
  namespace jest {
    // eslint-disable-next-line
    interface Matchers<R, T = {}> extends CustomMatchers<R> {}
  }
}
