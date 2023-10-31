import { Types } from "mongoose";
import { Role } from "./account";
import {
  Age,
  Behavioral,
  Breed,
  FosterType,
  Gender,
  GoodWith,
  Medical,
  Size,
} from "./post";

export interface IUser {
  email: string;
  picture?: string;
  preferredEmail?: string;
  name?: string;
  uid: string;
  role: Role;
  disabled: boolean;
  hasCompletedOnboarding: boolean;
  type?: FosterType[];
  size?: Size[];
  restrictedBreeds?: Breed[];
  preferredBreeds?: Breed[];
  gender?: Gender[];
  age?: Age[];
  dogsNotGoodWith?: GoodWith[];
  medical?: Medical[];
  behavioral?: Behavioral[];
}
