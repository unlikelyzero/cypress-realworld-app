import pick from "lodash-es/pick.js";
import { format as formatDate } from "date-fns";
import { existsSync, mkdirSync } from "fs";

declare global {
  namespace WebdriverIO {
    interface Browser {
      getBySel: (selector: string) => Promise<WebdriverIO.Element>;
      getBySelLike: (selector: string) => Promise<WebdriverIO.Element>;
      login: (
        username: string,
        password: string,
        options?: { rememberUser?: boolean }
      ) => Promise<void>;
      visualSnapshot: (name?: string) => Promise<void>;
      waitForTransactions: () => Promise<WebdriverIO.Element[]>;
    }
  }
}

// Custom command to get element by data-test attribute
browser.addCommand("getBySel", async function (selector: string) {
  return await $(`[data-test=${selector}]`);
});

// Custom command to get element by partial data-test attribute
browser.addCommand("getBySelLike", async function (selector: string) {
  return await $(`[data-test*=${selector}]`);
});

// Custom command to login using UI
browser.addCommand(
  "login",
  async function (username: string, password: string, options = { rememberUser: false }) {
    const signinPath = "/signin";
    const baseUrl = "http://localhost:3000";
    const currentUrl = await browser.getUrl();

    console.log("Current URL before login:", currentUrl);

    if (!currentUrl.includes(signinPath)) {
      await browser.url(`${baseUrl}${signinPath}`);
    }

    // Wait for login form to be present and interactable
    const usernameInput = await browser.getBySel("signin-username");
    await usernameInput.waitForDisplayed({ timeout: 10000 });
    await usernameInput.waitForClickable({ timeout: 10000 });

    const passwordInput = await browser.getBySel("signin-password");
    await passwordInput.waitForDisplayed({ timeout: 10000 });
    await passwordInput.waitForClickable({ timeout: 10000 });

    const submitButton = await browser.getBySel("signin-submit");
    await submitButton.waitForDisplayed({ timeout: 10000 });
    await submitButton.waitForClickable({ timeout: 10000 });

    // Use setValue instead of clear + type
    await usernameInput.setValue(username);
    await passwordInput.setValue(password);

    if (options.rememberUser) {
      const rememberMeCheckbox = await browser.getBySel("signin-remember-me");
      await rememberMeCheckbox.waitForDisplayed({ timeout: 10000 });
      await rememberMeCheckbox.waitForClickable({ timeout: 10000 });
      await rememberMeCheckbox.click();
    }

    await submitButton.click();
    await browser.waitUntil(
      async () => {
        const url = await browser.getUrl();
        return url.includes("/");
      },
      {
        timeout: 10000,
        timeoutMsg: "Expected URL to change after login",
      }
    );
  }
);

// Custom command to take a visual snapshot
browser.addCommand("visualSnapshot", async function (name) {
  const snapshotName = name || new Date().toISOString();
  // Create screenshots directory if it doesn't exist
  const screenshotsDir = "./screenshots";
  if (!existsSync(screenshotsDir)) {
    mkdirSync(screenshotsDir, { recursive: true });
  }
  await browser.saveScreenshot(`${screenshotsDir}/${snapshotName}.png`);
});

// Custom command to wait for transactions list
browser.addCommand("waitForTransactions", async function () {
  return await $$('[data-test*="transaction-item"]');
});
