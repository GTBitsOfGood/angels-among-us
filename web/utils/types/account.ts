export interface IAccount {
  email: string;
  role: Role;
}

export enum Role {
  Admin = "admin",
  ContentCreator = "contentCreator",
  Volunteer = "volunteer",
}
