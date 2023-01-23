import mongoose from "mongoose";
const { Schema } = mongoose;

export interface IAccount {
  email: string;
  admin: boolean;
}

const accountSchema = new Schema<IAccount>({
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  admin: {
    type: Boolean,
    required: true,
  },
});

export default mongoose.models.Account ||
  mongoose.model("Account", accountSchema);
