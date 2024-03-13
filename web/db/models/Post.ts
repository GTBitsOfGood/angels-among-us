import mongoose, { Types } from "mongoose";
import {
  IPost,
  FosterType,
  Size,
  Breed,
  Gender,
  Age,
  Temperament,
  GoodWith,
  Medical,
  Behavioral,
  Trained,
  Status,
  IDraftPost,
} from "../../utils/types/post";
const { Schema } = mongoose;

const postSchema = new Schema<IPost | IDraftPost>({
  date: { type: Date, default: Date.now },
  name: { type: String, required: true },
  description: { type: String },
  type: {
    type: String,
    default: null,
    enum: [...Object.values(FosterType), null],
  },
  size: {
    type: String,
    default: null,
    enum: [...Object.values(Size), null],
  },
  breed: [
    {
      type: String,
      enum: Object.values(Breed),
    },
  ],
  gender: {
    type: String,
    default: null,
    enum: [...Object.values(Gender), null],
  },
  age: {
    type: String,
    default: null,
    enum: [...Object.values(Age), null],
  },
  temperament: [
    {
      type: String,
      enum: Object.values(Temperament),
    },
  ],
  medical: [
    {
      type: String,
      enum: Object.values(Medical),
    },
  ],
  behavioral: [
    {
      type: String,
      enum: Object.values(Behavioral),
    },
  ],
  houseTrained: {
    type: String,
    required: true,
    enum: Object.values(Trained),
  },
  crateTrained: {
    type: String,
    required: true,
    enum: Object.values(Trained),
  },
  spayNeuterStatus: {
    type: String,
    required: true,
    enum: Object.values(Trained),
  },
  getsAlongWithMen: {
    type: String,
    required: true,
    enum: Object.values(Trained),
  },
  getsAlongWithWomen: {
    type: String,
    required: true,
    enum: Object.values(Trained),
  },
  getsAlongWithOlderKids: {
    type: String,
    required: true,
    enum: Object.values(Trained),
  },
  getsAlongWithYoungKids: {
    type: String,
    required: true,
    enum: Object.values(Trained),
  },
  getsAlongWithLargeDogs: {
    type: String,
    required: true,
    enum: Object.values(Trained),
  },
  getsAlongWithSmallDogs: {
    type: String,
    required: true,
    enum: Object.values(Trained),
  },
  getsAlongWithCats: {
    type: String,
    required: true,
    enum: Object.values(Trained),
  },
  covered: {
    type: Boolean,
    default: false,
  },
  draft: {
    type: Boolean,
    default: undefined,
  },
  pending: {
    type: Boolean,
    default: true,
  },
  attachments: [
    {
      type: String,
      required: true,
    },
  ],
  usersAppliedTo: {
    type: [{ type: String }], // Firebase UID
    default: [],
    required: true,
  },
});

export default mongoose.models.Post || mongoose.model("Post", postSchema);
