import mongoose from "mongoose";
const { Schema } = mongoose;

export interface IAccount {
  email: string;
  role: Role;
}

export enum Role {
  Admin = "admin",
  ContentCreator = "contentCreator",
  Volunteer = "volunteer",
}

const accountSchema = new Schema<IAccount>({
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  role: {
    type: String,
    required: true,
    enum: Object.values(Role),
  },
});

export default mongoose.models.Account ||
  mongoose.model("Account", accountSchema);
