declare var global: any;

import mongoose, { ConnectOptions } from "mongoose";
import { findAccount, removeAllAccounts } from "../../../db/actions/Account";
import { randomAccounts } from "../../../db/actions/__mocks__/Account";
import Account from "../../../db/models/Account";

/**
 * Tests db actions. Uses an in-memory database to mimic real db.
 *
 * @group db/Account
 * @group db
 * @group unit
 */
describe("[DB] Account - Unit Test", () => {
  beforeAll(async () => {
    await mongoose.connect(
      global.__MONGO_URI__,
      { useNewUrlParser: true } as ConnectOptions,
      (err) => {
        if (err) {
          console.error(err);
          process.exit(1);
        }
      }
    );
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("findAccount", () => {
    beforeEach(async () => {
      await Account.insertMany(randomAccounts);
    });

    afterEach(async () => {
      await Account.deleteMany({});
    });

    test("happy", async () => {
      const searchSubject = randomAccounts[0];
      const account = await findAccount(searchSubject.email);

      expect(account).not.toBeNull();
      expect(account).toMatchObject(searchSubject);
    });

    test("unauthorized email", async () => {
      const account = await findAccount("test@example.com");

      expect(account).toBeNull();
    });
  });

  describe("removeAllAccounts", () => {
    beforeEach(async () => {
      await Account.insertMany(randomAccounts);
    });

    afterEach(async () => {
      await Account.deleteMany({});
    });

    test("happy", async () => {
      await removeAllAccounts(
        randomAccounts.slice(0, 5).map((account) => account.email)
      );

      const actual = await Account.find({}, { _id: 0, __v: 0 });
      const expected = randomAccounts.slice(5, 10);

      expect(actual.length).toBe(5);
      expect(actual).toMatchObject(expected);
    });

    test("unauthorized account", async () => {
      await removeAllAccounts(["test@example.com"]);

      const actual = await Account.find({}, { _id: 0, __v: 0 });

      expect(actual.length).toBe(10);
      expect(actual).toMatchObject(randomAccounts);
    });

    test("authorized with unauthorized accounts", async () => {
      await removeAllAccounts([
        "test@example.com",
        ...randomAccounts.slice(0, 5).map((account) => account.email),
      ]);

      const actual = await Account.find({}, { _id: 0, __v: 0 });
      const expected = randomAccounts.slice(5, 10);

      expect(actual.length).toBe(5);
      expect(actual).toMatchObject(expected);
    });
  });

  describe("updateAccount", () => {
    test("happy", async () => {});
  });

  describe("addAccount", () => {
    test("happy", async () => {});
  });

  describe("findAll", () => {
    test("happy", async () => {});
  });
});
