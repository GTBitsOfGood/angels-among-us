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
    return await Account.findOne(
      { email },
      { _id: 0, __v: 0 },
      { session: session }
    );
  } catch (e) {
    return null;
  }
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
    projection: {
      _id: 0,
      __v: 0,
    },
  });
}

async function addAccount(
  inputData: IAccount,
  session?: ClientSession
): Promise<IAccount | null> {
  try {
    const document = new Account(inputData);
    const {
      _doc: { _id, __v, ...accountDoc },
    } = await document.save({ session: session });
    return accountDoc;
  } catch (e) {
    return null;
  }
}

async function findAll(
  session?: ClientSession
): Promise<HydratedDocument<IAccount>[]> {
  try {
    return await Account.find({}, { _id: 0, __v: 0 });
  } catch (e) {
    return [];
  }
}

export { findAccount, addAccount, removeAllAccounts, updateAccount, findAll };
