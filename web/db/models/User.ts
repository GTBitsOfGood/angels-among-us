import mongoose from "mongoose";
import { Role } from "../../utils/types/account";
import { IUser } from "../../utils/types/user";
const { Schema } = mongoose;

const userSchema = new Schema<IUser>({
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
  role: {
    type: String,
    required: true,
    enum: Object.values(Role),
  },
  disabled: {
    type: Boolean,
    required: true,
    default: false,
  },
});

export default mongoose.models.User || mongoose.model("User", userSchema);
