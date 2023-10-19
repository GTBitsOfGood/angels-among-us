import {
  ClientSession,
  FilterQuery,
  HydratedDocument,
  UpdateQuery,
} from "mongoose";
import User from "../models/User";
import { IUser } from "../../utils/types/user";
import {
  Age,
  Behavioral,
  Breed,
  FosterType,
  Gender,
  GoodWith,
  Size,
  Medical,
} from "../../utils/types/post";

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

export interface SearchUsersParams {
  type?: FosterType[];
  size?: Size[];
  preferredBreeds?: Breed[];
  gender?: Gender[];
  age?: Age[];
  dogsNotGoodWith?: GoodWith[];
  medical?: Medical[];
  behavioral?: Behavioral[];
}

function createFilterQuery(
  searchParams: SearchUsersParams
): FilterQuery<IUser> {
  const filter: FilterQuery<IUser> = {
    hasCompletedOnboarding: true,
    disabled: false,
  };

  const fieldMap: Record<
    keyof SearchUsersParams,
    FilterQuery<IUser>[keyof IUser]
  > = {
    type: { $all: searchParams.type },
    size: { $all: searchParams.size },
    preferredBreeds: { $all: searchParams.preferredBreeds },
    gender: { $all: searchParams.gender },
    age: { $all: searchParams.age },
    dogsNotGoodWith: { $all: searchParams.dogsNotGoodWith },
    medical: { $all: searchParams.medical },
    behavioral: { $all: searchParams.behavioral },
  };

  return Object.entries(searchParams).reduce(
    (acc, [key, val]: [string, SearchUsersParams[keyof SearchUsersParams]]) => {
      if (val && val.length > 0) {
        acc[key] = fieldMap[key as keyof typeof fieldMap];
      }
      return acc;
    },
    filter
  );
}

async function searchUsers(
  searchParams: SearchUsersParams,
  session?: ClientSession
): Promise<IUser[]> {
  const filter = createFilterQuery(searchParams);
  return await User.find(filter, { _id: 0, __v: 0 }, { session }).exec();
}

export {
  createUser,
  findUserByUid,
  findUserByEmail,
  updateAllUsers,
  updateUserByEmail,
  updateUserByUid,
  searchUsers,
};
