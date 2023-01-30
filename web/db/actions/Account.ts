import { ClientSession } from "mongoose";
import Account from "../models/Account";

async function removeAccount(email: string, session?: ClientSession) {
  return await Account.findOneAndDelete({ email }, { session: session });
}

async function addAccount(
  inputData: [string, boolean],
  session?: ClientSession
) {
  const email: string = inputData[0];
  const admin: boolean = inputData[1];
  return await Account.create([{ email, admin }], { session: session });
}

async function findAccount(email: string) {
  return await Account.find({ email });
}

export { addAccount, findAccount, removeAccount };
