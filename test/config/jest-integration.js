// eslint-disable-next-line @typescript-eslint/no-var-requires
const { jest: jestConfig } = require('../../package.json');

module.exports = {
  ...jestConfig,
  rootDir: '../..',
  testRegex: '.test.ts$',
  coverageDirectory: './coverage-integration',
};
