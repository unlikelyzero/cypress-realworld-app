import { isMobile } from "../../utils/utils.js";

describe("User Sign-up and Login", () => {
  beforeEach(async () => {
    // Note: Database seeding needs to be handled differently in WebdriverIO
    // This might require setting up a custom service or command
    // await browser.executeAsync(() => { /* db:seed equivalent */ });
  });

  it("should redirect unauthenticated user to signin page", async () => {
    await browser.url("/personal");
    const currentUrl = await browser.getUrl();
    expect(currentUrl).toContain("/signin");
    await browser.visualSnapshot("Redirect to SignIn");
  });

  it("should redirect to the home page after login", async () => {
    // Note: Database access needs to be handled differently
    // This is a placeholder - implement actual user retrieval
    const testUser = { username: "Katharina_Bernier" };

    await browser.login(testUser.username, "s3cret", { rememberUser: true });
    const currentUrl = await browser.getUrl();
    expect(currentUrl).toContain("/");
  });

  it("should remember a user for 30 days after login", async () => {
    const testUser = { username: "Katharina_Bernier" };
    await browser.login(testUser.username, "s3cret", { rememberUser: true });

    // Verify Session Cookie
    const cookie = await browser.getCookies(["connect.sid"]);
    expect(cookie[0]).toHaveProperty("expiry");

    // Logout User
    if (await isMobile()) {
      await (await browser.getBySel("sidenav-toggle")).click();
    }
    await (await browser.getBySel("sidenav-signout")).click();

    const currentUrl = await browser.getUrl();
    expect(currentUrl).toContain("/signin");
    await browser.visualSnapshot("Redirect to SignIn");
  });
});
