import type { Options } from "@wdio/types";

export const baseConfig: Partial<Options.Testrunner> = {
  specs: ["./test/specs/example.spec.ts"],
  exclude: [],
  maxInstances: 1,

  logLevel: "debug",
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,

  framework: "mocha",
  reporters: ["spec"],

  mochaOpts: {
    ui: "bdd",
    timeout: 60000,
  },

  autoCompileOpts: {
    autoCompile: true,
    tsNodeOpts: {
      project: "./tsconfig.json",
      transpileOnly: true,
    },
  },

  before: async function () {
    await import("./test/utils/commands.js");
  },

  // Automatically take screenshots on test failure
  afterTest: async function (test, context, { error, result, duration, passed, retries }) {
    if (!passed) {
      await browser.takeScreenshot();
    }
  },
};
