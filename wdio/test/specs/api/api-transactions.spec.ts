import { faker } from "@faker-js/faker";
import { isEqual } from "lodash/fp";
import { pick } from "lodash-es/pick.js";

// Note: Import these from your project's models
interface User {
  id: string;
  username: string;
}

interface Transaction {
  id: string;
  senderId: string;
  receiverId: string;
}

interface NotificationType {
  id: string;
}

interface BankAccount {
  id: string;
}

interface TestTransactionsCtx {
  receiver?: User;
  authenticatedUser?: User;
  transactionId?: string;
  notificationId?: string;
  bankAccountId?: string;
}

const getFakeAmount = () => parseInt(faker.finance.amount(), 10);
const apiTransactions = `${process.env.API_URL}/transactions`;

describe("Transactions API", () => {
  let ctx: TestTransactionsCtx = {};

  const isSenderOrReceiver = ({ senderId, receiverId }: Transaction) =>
    isEqual(senderId, ctx.authenticatedUser!.id) || isEqual(receiverId, ctx.authenticatedUser!.id);

  beforeEach(async () => {
    // Note: Database seeding needs to be handled differently in WebdriverIO
    // This might require setting up a custom service or command
    // await browser.executeAsync(() => { /* db:seed equivalent */ });

    // Note: These database operations need to be implemented differently
    // This is a placeholder implementation
    const response = await fetch(`${process.env.API_URL}/users`);
    const users = await response.json();
    ctx.authenticatedUser = users[0];
    ctx.receiver = users[1];

    // Login via API
    await fetch(`${process.env.API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: ctx.authenticatedUser.username,
        password: "s3cret",
      }),
    });

    // Get sample transaction
    const txResponse = await fetch(`${process.env.API_URL}/transactions`);
    const transactions = await txResponse.json();
    ctx.transactionId = transactions[0].id;

    // Get sample notification
    const notifResponse = await fetch(`${process.env.API_URL}/notifications`);
    const notifications = await notifResponse.json();
    ctx.notificationId = notifications[0].id;

    // Get sample bank account
    const bankResponse = await fetch(`${process.env.API_URL}/bankaccounts`);
    const bankAccounts = await bankResponse.json();
    ctx.bankAccountId = bankAccounts[0].id;
  });

  describe("GET /transactions", () => {
    it("gets a list of transactions for a user", async () => {
      const response = await fetch(apiTransactions);
      const transactions = await response.json();

      expect(response.status).toBe(200);
      expect(transactions.length).toBeGreaterThan(0);
      expect(transactions.every(isSenderOrReceiver)).toBe(true);
    });
  });
});
