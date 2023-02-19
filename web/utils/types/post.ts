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
