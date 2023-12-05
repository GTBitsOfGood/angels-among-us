import { IAccount, Role } from "../../../utils/types/account";
import {
  ClientSession,
  HydratedDocument,
  ObjectId,
  UpdateQuery,
} from "mongoose";
import { faker } from "@faker-js/faker";

faker.seed(0);

function createRandomAccount(): IAccount {
  return {
    email: faker.internet.email(),
    role: faker.helpers.arrayElement(Object.values(Role)),
  };
}

export const randomAccounts = Array.from({ length: 10 }).map(() =>
  createRandomAccount()
);

async function findAccount(
  email: string,
  session?: ClientSession
): Promise<IAccount | null> {
  return randomAccounts.find((account) => account.email === email) ?? null;
}

async function removeAllAccounts(emails: string[], session?: ClientSession) {
  return randomAccounts.reduce((acc, cur) => {
    if (emails.includes(cur.email)) {
      return (acc += 1);
    } else {
      return acc;
    }
  }, 0);
}

async function updateAccount(
  email: string,
  update: UpdateQuery<IAccount>,
  session?: ClientSession
) {
  return randomAccounts.some((account) => account.email === email)
    ? update
    : null;
}

async function addAccount(inputData: IAccount, session?: ClientSession) {
  return randomAccounts.some((account) => account.email === inputData.email)
    ? null
    : {
        ...inputData,
        _id: faker.string.alphanumeric(24),
      };
}

async function findAll(session?: ClientSession) {
  return randomAccounts;
}

async function searchAccounts(
  searchSubject: string,
  session?: ClientSession
): Promise<Array<IAccount>> {
  const regexTerm = new RegExp(`.*${searchSubject}.*`, "i");
  const accounts = randomAccounts.filter((account) =>
    regexTerm.test(account.email)
  );
  return accounts ?? [];
}

export {
  findAccount,
  addAccount,
  removeAllAccounts,
  updateAccount,
  findAll,
  searchAccounts,
};
