import { ClientSession, HydratedDocument, UpdateQuery } from "mongoose";
import User from "../models/User";
import { IUser } from "../../utils/types/user";

async function createUser(user: IUser, session?: ClientSession) {
  return await User.create([user], { session: session });
}

async function updateAllUsers(
  emails: string[],
  update: UpdateQuery<IUser>,
  session?: ClientSession
) {
  return await User.updateMany({ email: { $in: emails } }, update, {
    session: session,
  });
}

async function findUserByUid(
  uid: string,
  session?: ClientSession
): Promise<HydratedDocument<IUser> | null> {
  return await User.findOne({ uid }, null, { session });
}

async function updateUserByEmail(
  email: string,
  update: UpdateQuery<IUser>,
  session?: ClientSession
): Promise<IUser | null> {
  return await User.findOneAndUpdate({ email }, update, { session: session });
}

async function updateUserByUid(
  uid: string,
  update: UpdateQuery<IUser>,
  session?: ClientSession
) {
  return await User.findOneAndUpdate({ uid }, update, { session: session });
}

export {
  createUser,
  findUserByUid,
  updateAllUsers,
  updateUserByEmail,
  updateUserByUid,
};
