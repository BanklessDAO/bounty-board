/**
 * Config settings:
 * https://jestjs.io/docs/en/configuration.html
 * 
 * This was a pain: 
 * * Babel is recommended by jest to faciliate TS and TSX testing, but will mess with spies and mocks.
 * * ts-jest without config will not be able to process TSX files.
 * * Uing Enzyme `mount` requires a virtual dom, but mongoose advises against it.
 * 
 * We therefore split testing of .tsx files and .ts files into "client" and "server" tests.
 * You can see this in the RegExp `testMatch` settings below.
 * 
 * If we need to, we can define explicitly match `.client.` and `.server.` test
 * files, but I haven't done that here.
 * @projects configures a separate jest environment for each side of Next:
 *   @client is configured to parse TSX files and use the jsdom
 *   @server uses the (default) "node" environment and the default ts-jest setttings
 * 
 * On the client side:
 *  @setupFilesAfterEnv required for Enzyme testing
 *  @globals configures ts-jest to work with TSX files by extending the typescript config
 * @moduleNameMapper is used to replace static files like CSS
 * */

module.exports = {
  projects: [
    {
      displayName: 'server',
      preset: 'ts-jest',
      testMatch: ["**/?(*.)+(spec|test).[tj]s"],
      moduleNameMapper: {
        '@/(.*)$': '<rootDir>/src/$1',
        '@tests/(.*)$': '<rootDir>/tests/$1'
      },   
    },
    {
      displayName: 'client',
      testEnvironment: "jsdom",
      preset: 'ts-jest/presets/js-with-ts',
      setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
      globals: {
        'ts-jest': {
          tsconfig: '<rootDir>/tsconfig.jest.json',
        },
      },
      testMatch: ["**/?(*.)+(spec|test).[tj]sx"],
      moduleNameMapper: {
        '^.+\\.(css|scss|less|sass)$': '<rootDir>/tests/stubs/css.stub.ts',
        '@/(.*)$': '<rootDir>/src/$1'
      },
    }
  ],
  collectCoverageFrom: [
    "<rootDir>/src/**/*.{js,ts}",
    "!**/node_modules/**",
  ],
}