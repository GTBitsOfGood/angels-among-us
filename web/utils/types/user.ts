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
  Status,
  Temperament,
  Trained,
} from "./post";

export interface IUser {
  email: string;
  name: string;
  uid: string;
  role: Role;
  disabled: boolean;
  type?: FosterType[];
  size?: Size[];
  restrictedBreeds?: Breed[];
  preferredBreeds?: Breed[];
  gender?: Gender[];
  age?: Age[];
  temperament?: Temperament[];
  dogsNotGoodWith?: GoodWith[];
  medical?: Medical[];
  behavioral?: Behavioral[];
  houseTrained?: Trained[];
  spayNeuterStatus?: Status[];
}
