import { baseConfig } from "./wdio.conf.base.js";
import type { Options } from "@wdio/types";

export const config: Options.Testrunner = {
  ...baseConfig,
  runner: "local",
  // Use the slow proxy on port 3003
  baseUrl: "http://localhost:3003/",
  hostname: "localhost",
  port: 4444,
  path: "/wd/hub",
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
