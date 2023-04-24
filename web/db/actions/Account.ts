import {
  ClientSession,
  HydratedDocument,
  ObjectId,
  UpdateQuery,
} from "mongoose";
import Account from "../models/Account";
import { IAccount } from "../../utils/types/account";

async function findAccount(
  email: string,
  session?: ClientSession
): Promise<HydratedDocument<IAccount> | null> {
  try {
    return await Account.findOne({ email }, null, { session: session });
  } catch (e) {
    return null;
  }
}

async function removeAccount(id: ObjectId, session?: ClientSession) {
  return await Account.findOneAndDelete({ _id: id }, { session: session });
}

async function removeAllAccounts(emails: string[], session?: ClientSession) {
  return await Account.deleteMany(
    { email: { $in: emails } },
    { session: session }
  );
}

async function updateAccount(
  email: string,
  update: UpdateQuery<IAccount>,
  session?: ClientSession
) {
  return await Account.findOneAndUpdate({ email }, update, {
    session: session,
  });
}

async function addAccount(inputData: IAccount, session?: ClientSession) {
  try {
    return await Account.create([inputData], { session: session });
  } catch (e) {
    return null;
  }
}

async function findAll(
  session?: ClientSession
): Promise<HydratedDocument<IAccount>[]> {
  try {
    return await Account.find();
  } catch (e) {
    return [];
  }
}

export {
  findAccount,
  addAccount,
  removeAccount,
  removeAllAccounts,
  updateAccount,
  findAll,
};
