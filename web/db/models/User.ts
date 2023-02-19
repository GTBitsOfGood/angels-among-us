import mongoose, { mongo } from "mongoose";
const { Schema } = mongoose;

export interface IUser {
  email: string;
  name: string;
  uid: string;
  admin: boolean;
  disabled: boolean;
}

const userSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  uid: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  admin: {
    type: Boolean,
    required: false,
  },
});

export default mongoose.models.User || mongoose.model("User", userSchema);
