import { ClientSession, UpdateQuery } from "mongoose";
import Account from "../models/Account";
import { IAccount } from "../../utils/types/account";

async function findAccount(email: string, session?: ClientSession) {
  try {
    return await Account.findOne({ email }, null, { session: session });
  } catch (error) {
    console.log(error);
  }
}

async function removeAccount(email: string, session?: ClientSession) {
  return await Account.findOneAndDelete({ email }, { session: session });
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

export { findAccount, addAccount, removeAccount, updateAccount };
