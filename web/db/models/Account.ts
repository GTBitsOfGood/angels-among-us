import mongoose from "mongoose";
const { Schema } = mongoose;

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
