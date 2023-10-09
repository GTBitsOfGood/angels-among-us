import { ClientSession, Types, UpdateQuery } from "mongoose";
import { faker } from "@faker-js/faker";
import { IUser } from "../../../utils/types/user";
import { Role } from "../../../utils/types/account";
var mongoose = require("mongoose");

faker.seed(0);

function createRandomUser(): IUser & { _id: Types.ObjectId } {
  return {
    _id: new mongoose.Types.ObjectId(),
    email: faker.internet.email(),
    name: faker.person.fullName(),
    uid: faker.string.alphanumeric(28),
    role: faker.helpers.arrayElement(Object.values(Role)),
    disabled: faker.datatype.boolean(),
    hasCompletedOnboarding: faker.datatype.boolean(),
  };
}

export const randomUsers = Array.from({ length: 10 }).map(() =>
  createRandomUser()
);

async function createUser(user: IUser, session?: ClientSession) {
  return {
    ...user,
    _id: faker.string.alphanumeric(24),
  };
}

async function updateAllUsers(
  emails: string[],
  update: UpdateQuery<IUser>,
  session?: ClientSession
) {
  const count = randomUsers.reduce((acc, cur) => {
    if (emails.includes(cur.email)) {
      return (acc += 1);
    } else {
      return acc;
    }
  }, 0);
  return {
    matchedCount: count,
    modifiedCount: count,
    acknowledged: true,
    upsertedId: null,
    upsertedCount: 0,
  };
}

async function findUserByUid(
  uid: string,
  session?: ClientSession
): Promise<IUser | null> {
  return randomUsers.find((user) => user.uid === uid) ?? null;
}

async function updateUserByEmail(
  email: string,
  update: UpdateQuery<IUser>,
  session?: ClientSession
) {
  return randomUsers.some((user) => user.email === email) ? update : null;
}

async function updateUserByUid(
  uid: string,
  update: UpdateQuery<IUser>,
  session?: ClientSession
) {
  return randomUsers.some((user) => user.uid === uid) ? update : null;
}

export {
  createUser,
  findUserByUid,
  updateAllUsers,
  updateUserByEmail,
  updateUserByUid,
};
