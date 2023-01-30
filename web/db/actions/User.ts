import { ClientSession, UpdateQuery } from "mongoose";
import User, { IUser } from "../models/User";

async function updateUserAccess(email: string, admin: boolean) {
  return await User.updateOne(
    { email: email },
    { $set: { admin: admin, disabled: false } }
  );
}

async function updateUser(
  email: string,
  update: UpdateQuery<IUser>,
  session?: ClientSession
) {
  return await User.findOneAndUpdate({ email }, update, { session: session });
}

export { updateUser, updateUserAccess };
