import { baseConfig } from "./wdio.conf.base.js";
import type { Options } from "@wdio/types";

export const config: Options.Testrunner = {
  ...baseConfig,
  runner: "local",
  baseUrl: "http://localhost:3000",
  hostname: "localhost",
  capabilities: [
    {
      maxInstances: 5,
      browserName: "chrome",
      acceptInsecureCerts: true,
    },
  ],
  services: ["chromedriver"],
} as Options.Testrunner;
