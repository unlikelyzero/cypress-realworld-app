import Dinero from "dinero.js";
import { addDays, isWithinInterval, startOfDay } from "date-fns";
import { isMobile } from "../../utils/utils.js";

// Import these from your project's models
interface User {
  id: string;
  username: string;
}

interface TransactionResponseItem {
  id: string;
  amount: number;
  description: string;
  date: string;
  status: string;
}

interface TransactionFeedsCtx {
  allUsers?: User[];
  user?: User;
  contactIds?: string[];
}

describe("Transaction Feed", () => {
  const ctx: TransactionFeedsCtx = {};

  const feedViews = {
    public: {
      tab: "public-tab",
      tabLabel: "everyone",
      routeAlias: "publicTransactions",
      service: "publicTransactionService",
    },
    contacts: {
      tab: "contacts-tab",
      tabLabel: "friends",
      routeAlias: "contactsTransactions",
      service: "contactTransactionService",
    },
    personal: {
      tab: "personal-tab",
      tabLabel: "mine",
      routeAlias: "personalTransactions",
      service: "personalTransactionService",
    },
  };

  beforeEach(async () => {
    // Note: Database seeding needs to be handled differently
    // This might require setting up a custom service or command

    // Login as a test user
    const testUser = { username: "Katharina_Bernier" };
    await browser.login(testUser.username, "s3cret", { rememberUser: true });

    // Navigate to the main transaction feed
    await browser.url("/");
    await browser.waitForTransactions();
  });

  describe("transaction views", () => {
    it("should display transaction feeds", async () => {
      // Check if all feed tabs are present
      for (const view of Object.values(feedViews)) {
        const tab = await browser.getBySel(view.tab);
        await expect(tab).toBeDisplayed();
      }
    });

    it("should filter personal transactions", async () => {
      // Click personal tab
      await (await browser.getBySel(feedViews.personal.tab)).click();
      const transactions = await browser.waitForTransactions();
      expect(transactions.length).toBeGreaterThan(0);
    });

    it("should filter public transactions", async () => {
      // Click public tab
      await (await browser.getBySel(feedViews.public.tab)).click();
      const transactions = await browser.waitForTransactions();
      expect(transactions.length).toBeGreaterThan(0);
    });

    it("should filter contact transactions", async () => {
      // Click contacts tab
      await (await browser.getBySel(feedViews.contacts.tab)).click();
      const transactions = await browser.waitForTransactions();
      expect(transactions.length).toBeGreaterThan(0);
    });
  });

  describe("transaction list items", () => {
    beforeEach(async () => {
      // Navigate to personal transactions
      await (await browser.getBySel(feedViews.personal.tab)).click();
      await browser.waitForTransactions();
    });

    it("should display amount and description", async () => {
      const transaction = await browser.$("[data-test*='transaction-item']");

      // Check if amount is displayed
      const amount = await transaction.$("[data-test*='transaction-amount']");
      await expect(amount).toBeDisplayed();

      // Check if description is displayed
      const description = await transaction.$("[data-test*='transaction-description']");
      await expect(description).toBeDisplayed();
    });

    it("should navigate to transaction detail", async () => {
      // Click first transaction
      const transaction = await browser.$("[data-test*='transaction-item']");
      await transaction.click();

      // Verify navigation to detail page
      const url = await browser.getUrl();
      expect(url).toContain("/transaction/");
    });
  });
});
