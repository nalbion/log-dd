/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
// eslint-disable-next-line no-undef
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/jest-log/*.jest.ts'],
  setupFilesAfterEnv: ['./src/jest-log/setup-jest.ts']
};
