import mongoose from "mongoose";
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
} from "../../utils/types/post";
const { Schema } = mongoose;

const postSchema = new Schema<IPost>({
  date: { type: Date, default: Date.now },
  type: {
    type: String,
    required: true,
    enum: Object.values(FosterType),
  },
  size: {
    type: String,
    required: true,
    enum: Object.values(Size),
  },
  breed: {
    type: String,
    required: true,
    enum: Object.values(Breed),
  },
  gender: {
    type: String,
    required: true,
    enum: Object.values(Gender),
  },
  age: {
    type: String,
    required: true,
    enum: Object.values(Age),
  },
  temperament: {
    type: String,
    required: true,
    enum: Object.values(Temperament),
  },
  goodWith: [
    {
      type: String,
      required: true,
      enum: Object.values(GoodWith),
    },
  ],
  medical: [
    {
      type: String,
      required: true,
      enum: Object.values(Medical),
    },
  ],
  behavioral: [
    {
      type: String,
      required: true,
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
    enum: Object.values(Status),
  },
  covered: {
    type: Boolean,
    default: false,
  },
  attachments: [
    {
      type: String,
      required: true,
    },
  ],
});

export default mongoose.models.Post || mongoose.model("Post", postSchema);
