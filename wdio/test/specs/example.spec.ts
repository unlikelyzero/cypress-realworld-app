import { browser } from "@wdio/globals";
import "mocha";

describe("My Login application", () => {
  it("should redirect unauthenticated user to signin page", async () => {
    await browser.url("/personal");
    // Wait for the sign-in form to appear (up to 5 seconds)
    await browser.waitUntil(
      async () => {
        const signInForm = await browser.$('[data-test="signin-username"]');
        return signInForm.isExisting();
      },
      {
        timeout: 5000,
        timeoutMsg: "Expected sign-in form to be present after 5s",
      }
    );
    // Verify we're on the sign-in page
    const currentUrl = await browser.getUrl();
    expect(currentUrl).toContain("/signin");
  });

  it("submits the username and password to the backend", async () => {
    await browser.url("/signin");

    // Wait for username field and ensure it's interactable
    const usernameInput = await $("#username");
    await usernameInput.waitForClickable({ timeout: 10000 });
    await usernameInput.addValue("Katharina_Bernier");

    // Wait for password field and ensure it's interactable
    const passwordInput = await $("#password");
    await passwordInput.waitForClickable({ timeout: 10000 });
    await passwordInput.addValue("s3cret");

    // Wait for submit button and ensure it's interactable
    const submitButton = await $('[data-test="signin-submit"]');
    await submitButton.waitForClickable({ timeout: 10000 });
    await submitButton.click();

    // Wait for successful login by checking URL change
    await browser.waitUntil(
      async () => {
        const url = await browser.getUrl();
        return url.includes("/personal");
      },
      {
        timeout: 10000,
        timeoutMsg: "Expected to be redirected to personal page after 10s",
      }
    );
  });
});
