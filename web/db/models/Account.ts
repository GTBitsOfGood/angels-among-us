import mongoose from "mongoose";
import { IAccount, Role } from "../../utils/types/account";
const { Schema } = mongoose;

const accountSchema = new Schema<IAccount>(
  {
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
  },
  {
    autoCreate: true,
  }
);

export default mongoose.models.Account ||
  mongoose.model("Account", accountSchema);
