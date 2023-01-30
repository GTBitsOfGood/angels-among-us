import Account from "../models/Account";
import { ClientSession } from "mongoose";

async function addAccount(
  email: string,
  admin: boolean,
  session?: ClientSession
) {
  return await Account.create({ email, admin }, { session: session });
}

async function findAccount(email: string, session?: ClientSession) {
  return await Account.find({ email: email }, { session: session });
}

export { addAccount, findAccount };
