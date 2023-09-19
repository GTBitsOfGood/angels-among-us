declare var global: any;

import mongoose, { ConnectOptions } from "mongoose";
import {
  addAccount,
  findAccount,
  findAll,
  removeAllAccounts,
  updateAccount,
  searchAccounts,
} from "../../../db/actions/Account";
import { randomAccounts } from "../../../db/actions/__mocks__/Account";
import Account from "../../../db/models/Account";
import { Role } from "../../../utils/types/account";

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

  beforeEach(async () => {
    await Account.insertMany(randomAccounts);
  });

  afterEach(async () => {
    await Account.deleteMany({});
  });

  describe("findAccount", () => {
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

    test("db error", async () => {
      jest.spyOn(Account, "findOne").mockImplementationOnce(() => {
        throw new Error();
      });
      const account = await findAccount("test@example.com");
      expect(account).toBeNull();
    });
  });

  describe("removeAllAccounts", () => {
    test("happy", async () => {
      const deleted = await removeAllAccounts(
        randomAccounts.slice(0, 5).map((account) => account.email)
      );

      expect(deleted).toMatchObject({ deletedCount: 5 });

      const actual = await Account.find({}, { _id: 0, __v: 0 });
      const expected = randomAccounts.slice(5, 10);

      expect(actual.length).toBe(5);
      expect(actual).toMatchObject(expected);
    });

    test("unauthorized account", async () => {
      const deleted = await removeAllAccounts(["test@example.com"]);
      expect(deleted).toMatchObject({ deletedCount: 0 });

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
    test("happy", async () => {
      const searchSubject = {
        email: "test@example.com",
        role: Role.Volunteer,
      };
      const newAccount = new Account(searchSubject);
      await Account.create(newAccount);

      const accountBeforeUpdate = await Account.findOne(
        { email: searchSubject.email },
        { _id: 0, __v: 0 }
      );
      expect(accountBeforeUpdate).toMatchObject(searchSubject);

      const document = await updateAccount(searchSubject.email, {
        role: Role.Admin,
      });

      const accountAfterUpdate = await Account.findOne(
        { email: searchSubject.email },
        { _id: 0, __v: 0 }
      );

      expect(document).toMatchObject(accountBeforeUpdate);
      searchSubject.role = Role.Admin;
      expect(accountAfterUpdate).toMatchObject(searchSubject);
    });

    test("unauthorized account", async () => {
      const document = await updateAccount("test@example.com", {
        role: Role.Admin,
      });
      expect(document).toBeNull();
    });
  });

  describe("addAccount", () => {
    test("happy", async () => {
      const expected = {
        email: "test@example.com",
        role: Role.Admin,
      };

      const document = await addAccount(expected);
      expect(document).not.toBeNull();
      expect(document).toMatchObject(document!);

      const actual = await findAccount("test@example.com");
      expect(actual).toMatchObject(expected);
    });

    test("existing account", async () => {
      const existing = randomAccounts[0];
      const result = await addAccount({
        email: existing.email,
        role: Role.Volunteer,
      });
      expect(result).toBeNull();
    });
  });

  describe("findAll", () => {
    test("happy", async () => {
      const accounts = await findAll();
      expect(accounts).toHaveLength(randomAccounts.length);
      expect(accounts).toMatchObject(randomAccounts);
    });

    test("db error", async () => {
      jest.spyOn(Account, "find").mockImplementationOnce(() => {
        throw new Error();
      });
      const accounts = await findAll();
      expect(accounts).toMatchObject([]);
    });
  });

  describe("searchAccounts", () => {
    test("happy", async () => {
      const searchTerm = randomAccounts[0].email;
      const accounts = await searchAccounts(searchTerm);
      expect(
        accounts.every((account) => account.email.includes(searchTerm))
      ).toBe(true);
    });

    test("not found", async () => {
      const searchTerm = "ASDASDASD";
      const accounts = await searchAccounts(searchTerm);
      expect(accounts.length).toBe(0);
    });
  });
});
