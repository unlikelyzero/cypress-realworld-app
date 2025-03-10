import { baseConfig } from "./wdio.conf.base.js";
import type { Options } from "@wdio/types";

export const config: Options.Testrunner = {
  ...baseConfig,
  runner: "local",
  // Use the slow proxy on port 3003 for frontend
  baseUrl: "http://docker-toxiproxy-1:3003/",
  // Connect directly to Selenium but with connection options
  hostname: "localhost",
  port: 4444,
  path: "/wd/hub",
  connectionRetryTimeout: 300000, // 5 minutes
  connectionRetryCount: 5,
  // Add artificial latency at the protocol level
  beforeCommand: async function () {
    await new Promise((resolve) => setTimeout(resolve, 250));
  },
  capabilities: [
    {
      maxInstances: 5,
      browserName: "chrome",
      acceptInsecureCerts: true,
      "goog:chromeOptions": {
        args: ["--no-sandbox", "--disable-dev-shm-usage"],
      },
    },
  ],
} as Options.Testrunner;
