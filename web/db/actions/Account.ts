import { ClientSession } from "mongoose";
import Account from "../models/Account";

async function removeAccount(email: string, session?: ClientSession) {
  return await Account.findOneAndDelete({ email }, { session: session });
}

export { removeAccount };
