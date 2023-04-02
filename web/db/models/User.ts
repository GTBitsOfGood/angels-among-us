import mongoose from "mongoose";
import { Role } from "../../utils/types/account";
import {
  Age,
  Behavioral,
  Breed,
  FosterType,
  Gender,
  GoodWith,
  Medical,
  Size,
  Status,
  Temperament,
  Trained,
} from "../../utils/types/post";
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
  type: [
    {
      type: String,
      required: false,
      enum: Object.values(FosterType),
    },
  ],
  size: [
    {
      type: String,
      required: false,
      enum: Object.values(Size),
    },
  ],
  restrictedBreed: [
    {
      type: String,
      required: false,
      enum: Object.values(Breed),
    },
  ],
  preferredBreed: [
    {
      type: String,
      required: false,
      enum: Object.values(Breed),
    },
  ],
  gender: [
    {
      type: String,
      required: false,
      enum: Object.values(Gender),
    },
  ],
  age: [
    {
      type: String,
      required: false,
      enum: Object.values(Age),
    },
  ],
  temperament: [
    {
      type: String,
      required: false,
      enum: Object.values(Temperament),
    },
  ],
  goodWith: [
    {
      type: String,
      required: false,
      enum: Object.values(GoodWith),
    },
  ],
  medical: [
    {
      type: String,
      required: false,
      enum: Object.values(Medical),
    },
  ],
  behavioral: [
    {
      type: String,
      required: false,
      enum: Object.values(Behavioral),
    },
  ],
  houseTrained: [
    {
      type: String,
      required: false,
      enum: Object.values(Trained),
    },
  ],
  spayNeuterStatus: [
    {
      type: String,
      required: false,
      enum: Object.values(Status),
    },
  ],
});

export default mongoose.models.User || mongoose.model("User", userSchema);
