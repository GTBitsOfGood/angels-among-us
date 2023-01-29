import { ClientSession, UpdateQuery } from "mongoose";
import Account, { IAccount } from "../models/Account";

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

export { removeAccount, updateAccount };
