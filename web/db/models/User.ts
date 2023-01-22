import mongoose from "mongoose";
const { Schema } = mongoose;

export interface IUser {
  email: string;
  firstName: string;
  lastName: string;
  uid: string;
  admin: boolean;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  firstName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  uid: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  admin: {
    type: Boolean,
    required: true,
    default: false,
  },
});

export default mongoose.models.User || mongoose.model("User", userSchema);
