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
  type: {
    type: [
      {
        type: String,
        enum: Object.values(FosterType),
      },
    ],
    default: undefined,
    required: false,
  },
  size: {
    type: [
      {
        type: String,
        enum: Object.values(Size),
      },
    ],
    default: undefined,
    required: false,
  },
  restrictedBreeds: {
    type: [
      {
        type: String,
        enum: Object.values(Breed),
      },
    ],
    default: undefined,
    required: false,
  },
  preferredBreeds: {
    type: [
      {
        type: String,
        enum: Object.values(Breed),
      },
    ],
    default: undefined,
    required: false,
  },
  gender: {
    type: [
      {
        type: String,
        enum: Object.values(Gender),
      },
    ],
    default: undefined,
    required: false,
  },
  age: {
    type: [
      {
        type: String,
        enum: Object.values(Age),
      },
    ],
    default: undefined,
    required: false,
  },
  temperament: {
    type: [
      {
        type: String,
        enum: Object.values(Temperament),
      },
    ],
    default: undefined,
    required: false,
  },
  dogsNotGoodWith: {
    type: [
      {
        type: String,
        enum: Object.values(GoodWith),
      },
    ],
    default: undefined,
    required: false,
  },
  medical: {
    type: [
      {
        type: String,
        enum: Object.values(Medical),
      },
    ],
    default: undefined,
    required: false,
  },
  behavioral: {
    type: [
      {
        type: String,
        enum: Object.values(Behavioral),
      },
    ],
    default: undefined,
    required: false,
  },
  houseTrained: {
    type: [
      {
        type: String,
        enum: Object.values(Trained),
      },
    ],
    default: undefined,
    required: false,
  },
  spayNeuterStatus: {
    type: [
      {
        type: String,
        enum: Object.values(Status),
      },
    ],
    default: undefined,
    required: false,
  },
});

export default mongoose.models.User || mongoose.model("User", userSchema);
