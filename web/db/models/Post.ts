import mongoose, { Types } from "mongoose";
const { Schema } = mongoose;

export interface IPost {
  date: Date;
  title: string;
  body: string;
  author: Types.ObjectId;
  attachments: string[];
  offers: Types.ObjectId[];
}

const postSchema = new Schema<IPost>({
  date: { type: Date, default: Date.now },
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  attachments: {
    type: [
      {
        type: String,
      },
    ],
    required: true,
  },
  offers: {
    type: [
      {
        type: Schema.Types.ObjectId,
      },
    ],
  },
});

export default mongoose.models.Post || mongoose.model("Post", postSchema);
