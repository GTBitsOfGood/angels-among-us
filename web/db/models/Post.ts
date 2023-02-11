import mongoose from "mongoose";
const { Schema } = mongoose;

export enum FosterType {
  Return = "return",
  Boarding = "boarding",
  Temporary = "temporary",
  FosterMove = "fosterMove",
  NewIntake = "newIntake",
}

export enum Size {
  XS = "xs",
  S = "s",
  M = "m",
  L = "l",
  XL = "xl",
}

export enum Gender {
  Male = "male",
  Female = "female",
  Litter = "litter",
}

export enum Age {
  Puppy = "puppy",
  Young = "young",
  Adult = "adult",
  Senior = "senior",
  MomAndPuppies = "momAndPuppies",
}

export enum Temperament {
  Friendly = "friendly",
  Scared = "scared",
  Active = "active",
  Calm = "calm",
}

export enum GoodWith {
  Men = "men",
  Women = "women",
  OlderChildren = "olderChildren",
  YoungChildren = "youngChildren",
  LargeDogs = "largeDogs",
  SmallDogs = "smallDogs",
  Cats = "cats",
}

export enum Medical {
  Illness = "illness",
  Injury = "injury",
  Heartworms = "heartworms",
  Parvo = "parvo",
  ChronicCondition = "chronicCondition",
  Pregnant = "pregnant",
  Nursing = "nursing",
  BottleFeeding = "bottleFeeding",
  Hospice = "hospice",
}

export enum Behavioral {
  SeparationAnxiety = "separationAnxiety",
  Barking = "barking",
  Jumping = "jumping",
  FlightRisk = "flightRisk",
  BiteRisk = "biteRisk",
  PullsOnLeash = "pullsOnLeash",
}

export enum Trained {
  Yes = "yes",
  No = "no",
  Unknown = "unknown",
}

export enum Status {
  Yes = "yes",
  No = "no",
}

export interface IPost {
  date: Date;
  type: FosterType;
  size: Size;
  gender: Gender;
  age: Age;
  temperament: Temperament;
  goodWith: GoodWith[];
  medical: Medical[];
  behavioral: Behavioral[];
  houseTrained: Trained;
  crateTrained: Trained;
  spayNeuterStatus: Status;
  covered: boolean;
  attachments: string[];
}

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
