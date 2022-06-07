# log-dd

By taking TDD one step further, and specifying what the log output should look like
before writing the code we can expect that the logs will give maintainers clear and useful logs.

___
## **Getting Started**

### Prerequisites

- NPM 6
- [Typescript](https://www.typescriptlang.org/)

### Installing in your application

    $ npm i -D log-dd

In each test file, import `logCapture` and `chaiLog`. `logCapture.start/reset/stop()` should be called before and after tests.
```javascript
import chai, { expect } from 'chai';
import { logCapture, chaiLog } from 'log-dd';

chai.use(chaiLog);

// These lines can be omitted if you provide .mocharc.json and do not run `mocha --watch`
before(() => logCapture.start());
afterEach(() => logCapture.reset());
after(() => logCapture.stop());

describe('your feature', () => {
  it('does somthing', () => {
    console.info('Hello World!');
    expect(logCapture).that.console.info.includes('Hello World!');
  });
});
```

Alternatively, Mocha supports [root hook plugins](https://mochajs.org/#root-hook-plugins).

#### .mocharc.json
```json
{ "require": ["log-dd/dist/mocha-log-hooks"] }
```

## API

### `logCapture`

- `start()` monkey-patches the following methods of `console`, disabling output
and saving the records internally
  - `trace()`
  - `debug()`
  - `info()`
  - `log()` - retrieves all log records, prefixed with the level of each record
  - `warn()`
  - `error()`
- `stop()` resets the patched methods to their original implementation.
- `reset()` clears the saved records
- `get([trace|debug|info|log|warn|error])` returns an array of formatted strings
logged at or above the specified level.
If the level is 'log' or not specified all log records will be returned,
prefixed with the level.
- `log()` prints all of the saved records using the original console methods.

### Chai Plugin
`chaiLog` adds a `console` property to the [Chai](https://www.chaijs.com/) assertion API with methods to access:


Each of these methods can be used with a string or array of strings to compare against:
```typescript
console.debug('will not be included for "info"');
console.info('Hello World!');
console.error('expected error');
expect(logCapture).to.console.info(
  `Hello World!
expected error`
);
```

The methods can also be used without a parameter list and an array assertion will be returned:
```typescript
expect(logCapture).that.console.info.includes('Hello World!');
```

The `logCapture` is actually redundant. A function may be provided in its place:
```typescript
expect(() => console.info('Hello World!')).to.console.info('Hello World!');
```

### Jest Matcher

`jestLog` provides the following Jest Matchers:
- `console()`
- `console_trace()`
- `console_debug()`
- `console_info()`
- `console_log()`
- `console_warn()`
- `console_error()`

The matchers accept an optional `expected` parameter which can be a multi-line string or an array of strings.
If no `expected` parameter is provided to the methods then the log records will be compared
against a snapshot using [jest-snapshot](https://jestjs.io/docs/snapshot-testing).

#### jest.config.js
```javascript
/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
// eslint-disable-next-line no-undef
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.spec.ts'],
  setupFilesAfterEnv: ['./test/setup-jest.ts']
};
```

#### test/setup-jest.ts
```typescript
import jestLog from 'log-dd';
expect.extend(jestLog);
```

#### test.spec.ts
```typescript
import { jestLog } from 'log-dd';
import logCapture from '../log-capture';

describe('feature', () => {
  beforeAll(() => logCapture.start());
  afterEach(() => logCapture.reset());
  afterAll(() => logCapture.stop());

  test('match snapshot', () => {
    console.info('Hello World!');
    expect(logCapture).console_info();
  });

  test('match string', () => {
    console.info('Hello World!');
    expect(logCapture).console_info('Hello World!');
  });
});
```

___
## **Testing**
### Lint
    $ npm run lint
    $ npm run format

or, do it all together as the pre-commit hook does:

    $ npm run format:lint:fix

### Unit Tests
    $ npm test
    or
    $ npm run test:tdd

### Coverage Report
    $ npm run coverage

___
## Technology
- [Typescript](https://www.typescriptlang.org) - Typescript transpiler
- [Jest](https://jestjs.io/) - Unit testing framework
- [Mocha](https://github.com/mochajs/mocha) - Unit testing framework
- [Chai](https://github.com/chaijs/chai) - Unit testing assertions
- [Istanbul](https://istanbul.js.org) - Code coverage

___
## Best Practices and Coding Patterns
- [Clean Code](https://gist.github.com/wojteklu/73c6914cc446146b8b533c0988cf8d29)

___
## **Contributors**
- [Nick Albion](nalbion@palo-it.com)

Project scaffold generated by [`yo palo`](https://github.com/Palo-IT-Australia/generator-palo).
