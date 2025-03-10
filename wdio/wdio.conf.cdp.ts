import { baseConfig } from "./wdio.conf.base.js";
import type { Options } from "@wdio/types";

export const config: Options.Testrunner = {
  ...baseConfig,
  runner: "local",
  automationProtocol: "devtools",
  hostname: "localhost",
  port: 9222,
  capabilities: [
    {
      maxInstances: 5,
      browserName: "chrome",
      acceptInsecureCerts: true,
      "goog:chromeOptions": {
        args: ["--remote-debugging-port=9222", "--no-sandbox", "--disable-dev-shm-usage"],
      },
    },
  ],
} as Options.Testrunner;
