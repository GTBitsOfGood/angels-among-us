import { Role } from "./account";

export interface IUser {
  email: string;
  name: string;
  uid: string;
  role: Role;
  disabled: boolean;
}
