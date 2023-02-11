import { ClientSession, HydratedDocument, UpdateQuery } from "mongoose";
import User, { IUser } from "../models/User";

async function findUserByUid(
  uid: string,
  session?: ClientSession
): Promise<IUser | null> {
  return await User.findOne({ uid }, null, { session });
}

async function updateUser(
  email: string,
  update: UpdateQuery<IUser>,
  session?: ClientSession
): Promise<IUser | null> {
  return await User.findOneAndUpdate({ email }, update, { session: session });
}

export { findUserByUid, updateUser };
