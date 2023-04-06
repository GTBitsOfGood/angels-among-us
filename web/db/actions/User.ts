import {
  ClientSession,
  FilterQuery,
  HydratedDocument,
  ObjectId,
  UpdateQuery,
} from "mongoose";
import User from "../models/User";
import { IUser } from "../../utils/types/user";
import { Role } from "../../utils/types/account";

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

async function filterUsers(roles: Role[], emailQuery: string) {
  return await User.aggregate([
    {
      $search: {
        compound: {
          must: [
            {
              text: {
                query: roles,
                path: "role",
              },
            },
          ],
          filter: [
            {
              text: {
                query: emailQuery,
                path: "email",
              },
            },
          ],
        },
      },
    },
  ]);
}

export {
  createUser,
  findUserByUid,
  filterUsers,
  updateAllUsers,
  updateUserByEmail,
  updateUserByUid,
};
