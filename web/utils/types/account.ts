export interface IAccount {
  email: string;
  serializedEmail: string;
  role: Role;
}

export enum Role {
  Admin = "admin",
  ContentCreator = "contentCreator",
  Volunteer = "volunteer",
}

export const roleLabels: Record<Role, string> = {
  [Role.Admin]: "Administrator",
  [Role.ContentCreator]: "Content Creator",
  [Role.Volunteer]: "Volunteer",
};
