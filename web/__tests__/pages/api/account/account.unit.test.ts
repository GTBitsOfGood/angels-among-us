import { faker } from "@faker-js/faker";
import { TRPCError } from "@trpc/server";
import { randomAccounts } from "../../../../db/actions/__mocks__/Account";
import { randomUsers } from "../../../../db/actions/__mocks__/User";
import Account from "../../../../db/models/Account";
import { createContextInner } from "../../../../server/context";
import { appRouter } from "../../../../server/routers/_app";
import { callingUser } from "../../../../server/__mocks__/context";
import { Role } from "../../../../utils/types/account";

// Mocks procedures without authentication session
jest.mock("../../../../server/trpc");

// Mocks context without db connection
jest.mock("../../../../server/context");

// Mocks void db session
jest.spyOn(Account, "startSession").mockReturnValue(
  Promise.resolve({
    startTransaction: function () {},
    commitTransaction: function () {},
    abortTransaction: function () {},
  } as any)
);

// Mocks db actions to use direct array functions
jest.mock("../../../../db/actions/Account");
jest.mock("../../../../db/actions/User");

async function simulateUnauthenticatedSession() {
  const context = await createContextInner({ session: {} as any });
  const caller = appRouter.createCaller(context);
  return caller;
}

async function simulateAuthenticatedSession() {
  const context = await createContextInner();
  const caller = appRouter.createCaller(context);
  return caller;
}

/**
 * Tests account API endpoints. Mocks db action and validates result.
 * Assumes that the caller is authorized to make the API call.
 *
 * @group api/account
 * @group api
 * @group unit
 */
describe("[API] Account - Unit Test", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeAll(async () => {
    caller = await simulateAuthenticatedSession();
  });

  describe("account.getAll", () => {
    test("happy", async () => {
      const accounts = await caller.account.getAll();

      expect(accounts).not.toBeNull();
      expect(accounts).toMatchObject(randomAccounts);
    });
  });

  describe("account.getRole", () => {
    test("authorized email", async () => {
      const searchSubject = randomAccounts[0];
      const account = await caller.account.getRole({
        email: searchSubject.email,
      });

      expect(account).toMatchObject({ role: searchSubject.role });
    });

    test("unauthorized email", async () => {
      const searchSubjectEmail = "test@example.com";
      const account = await caller.account.getRole({
        email: searchSubjectEmail,
      });

      expect(account.role).toBeNull();
    });
  });

  describe("account.add", () => {
    test("happy", async () => {
      const account = await caller.account.add({
        email: "new@example.com",
        role: faker.helpers.arrayElement(Object.values(Role)),
      });

      expect(account).toMatchObject({
        success: true,
      });
    });

    test("add own account", async () => {
      const expected = expect(
        caller.account.add({
          email: callingUser.email,
          role: faker.helpers.arrayElement(Object.values(Role)),
        })
      ).rejects;

      await expected.toThrow(TRPCError);
      await expected.toThrow("User cannot add themselves");
    });

    test("existing account", async () => {
      const expected = expect(
        caller.account.add({
          email: randomAccounts[0].email,
          role: faker.helpers.arrayElement(Object.values(Role)),
        })
      ).rejects;

      await expected.toThrow(TRPCError);
      await expected.toThrow("Account already exists");
    });
  });

  describe("account.remove", () => {
    test("happy", async () => {
      const account = await caller.account.remove(
        randomUsers.slice(0, 5).map((user) => user.email)
      );

      expect(account).toMatchObject({
        success: true,
      });
    });

    test("unauthenticated caller", async () => {
      caller = await simulateUnauthenticatedSession();

      const expected = expect(
        caller.account.remove(randomUsers.slice(0, 5).map((user) => user.email))
      ).rejects;

      await expected.toThrow(TRPCError);
      await expected.toThrow("Unauthorized - Caller has no email");

      // Cleanup
      caller = await simulateAuthenticatedSession();
    });

    test("remove own account", async () => {
      const expected = expect(
        caller.account.remove([
          ...randomUsers.slice(1, 5).map((user) => user.email),
          callingUser.email,
        ])
      ).rejects;

      await expected.toThrow(TRPCError);
      await expected.toThrow("Unauthorized - Cannot remove own account");
    });
  });

  describe("account.modify", () => {
    test("happy", async () => {
      const account = await caller.account.modify({
        email: randomAccounts[0].email,
        role: faker.helpers.arrayElement(Object.values(Role)),
      });

      expect(account).toMatchObject({
        success: true,
      });
    });

    test("unauthenticated caller", async () => {
      caller = await simulateUnauthenticatedSession();

      const expected = expect(
        caller.account.modify({
          email: randomUsers[0].email,
          role: faker.helpers.arrayElement(Object.values(Role)),
        })
      ).rejects;

      await expected.toThrow(TRPCError);
      await expected.toThrow("Unauthorized - Caller has no email");

      // Cleanup
      caller = await simulateAuthenticatedSession();
    });

    test("modify own account", async () => {
      const expected = expect(
        caller.account.modify({
          email: callingUser.email,
          role: faker.helpers.arrayElement(Object.values(Role)),
        })
      ).rejects;

      await expected.toThrow(TRPCError);
      await expected.toThrow("Unauthorized - Cannot modify own account");
    });

    test("unauthorized email", async () => {
      const expected = expect(
        caller.account.modify({
          email: "test@example.com",
          role: faker.helpers.arrayElement(Object.values(Role)),
        })
      ).rejects;

      await expected.toThrow(TRPCError);
      await expected.toThrow("Account with specified email not found");
    });
  });
});
