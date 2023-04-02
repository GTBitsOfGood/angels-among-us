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
  restrictedBreed?: Breed[];
  preferredBreed?: Breed[];
  gender?: Gender[];
  age?: Age[];
  temperament?: Temperament[];
  goodWith?: GoodWith[];
  medical?: Medical[];
  behavioral?: Behavioral[];
  houseTrained?: Trained[];
  spayNeuterStatus?: Status[];
}
