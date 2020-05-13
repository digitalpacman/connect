"use strict";
const appLoader = require("@shipengine/integration-platform-loader");


const chai = require("chai");
let app;
/**
 * Perform one-time setup before any tests are run.
 */
before("Setup test environment", () => {
  // TODO: Add any logic needed to initialize the test environment
  app = await appLoader.loadApp(process.cwd());

});
