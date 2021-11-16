// Test client side only code
// Files ending with or "test.client"
const mainConfig = require("./jest.config");

module.exports = {
  ...mainConfig,
  testEnvironment: "jsdom",
  testMatch: ["**/?(*.)+(spec|test).[tj]sx"],
};