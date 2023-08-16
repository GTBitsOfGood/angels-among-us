import { ClientSession, HydratedDocument, UpdateQuery } from "mongoose";
import User from "../models/User";
import { IUser } from "../../utils/types/user";

async function createUser(
  user: IUser,
  session?: ClientSession
): Promise<IUser> {
  const document = new User(user);
  const {
    _doc: { _id, __v, ...userDoc },
  } = await document.save({ session: session });
  return userDoc;
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
): Promise<IUser | null> {
  return await User.findOne({ uid }, { _id: 0, __v: 0 }, { session });
}

async function findUserByEmail(
  email: string,
  session?: ClientSession
): Promise<HydratedDocument<IUser> | null> {
  return await User.findOne({ email }, { _id: 0, __v: 0 }, { session });
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
): Promise<IUser | null> {
  return await User.findOneAndUpdate({ uid }, update, {
    session: session,
    projection: {
      _id: 0,
      __v: 0,
    },
  });
}

export {
  createUser,
  findUserByUid,
  findUserByEmail,
  updateAllUsers,
  updateUserByEmail,
  updateUserByUid,
};
