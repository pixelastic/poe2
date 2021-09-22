const config = require('aberlaas/configs/jest.js');
const path = require('path');
const globalSetup = path.resolve(__dirname, './lib/jest/globalSetup.js');
const globalTeardown = path.resolve(__dirname, './lib/jest/globalTeardown.js');
const testEnvironment = path.resolve(
  __dirname,
  './lib/jest/testEnvironment.js'
);
module.exports = {
  ...config,
  globalSetup,
  globalTeardown,
  testEnvironment,
};
