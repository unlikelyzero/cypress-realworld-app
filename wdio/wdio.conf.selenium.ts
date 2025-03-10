import { baseConfig } from "./wdio.conf.base.js";
import type { Options } from "@wdio/types";

export const config: Options.Testrunner = {
  ...baseConfig,
  runner: "local",
  baseUrl: "http://frontend:3000/",
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
