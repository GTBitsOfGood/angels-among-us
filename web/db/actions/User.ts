import { ClientSession, UpdateQuery } from "mongoose";
import User, { IUser } from "../models/User";

async function updateUser(
  email: string,
  update: UpdateQuery<IUser>,
  session?: ClientSession
) {
  return await User.findOneAndUpdate({ email }, update, { session: session });
}

async function findUser(email: string) {
  return await User.find({ email });
}

export { updateUser, findUser };
