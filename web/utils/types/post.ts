export enum FosterType {
  Return = "return",
  Boarding = "boarding",
  Temporary = "temporary",
  FosterMove = "fosterMove",
  NewIntake = "newIntake",
}

export enum Breed {
  None = "none",
  AmericanEskimo = "americanEskimo",
  AustralianShepherd = "australianShepherd",
  Beagle = "beagle",
  BichonFrise = "bichonFrise",
  BorderCollie = "borderCollie",
  Boxer = "boxer",
  BrusselsGriffon = "brusselsGriffon",
  Bulldog = "bulldog",
  CaneCorsoMastiff = "caneCorsoMastiff",
  CattleDogHeeler = "cattleDogHeeler",
  Chihuahua = "chihuahua",
  ChowChow = "chowChow",
  Collie = "collie",
  Corgi = "corgi",
  Dachshund = "dachshund",
  Dalmatian = "dalmatian",
  DobermanPinscher = "dobermanPinscher",
  GermanShepherd = "germanShepherd",
  GoldenRetriever = "goldenRetriever",
  GreatDane = "greatDane",
  GreatPyrenees = "greatPyrenees",
  Greyhound = "greyhound",
  Hound = "hound",
  Husky = "husky",
  LabradorRetriever = "labradorRetriever",
  Malamute = "malamute",
  Maltese = "maltese",
  MinPin = "minPin",
  Mix = "mix",
  Newfoundland = "newfoundland",
  Pekingese = "pekingese",
  Pitbull = "pitbull",
  Pointer = "pointer",
  Pomeranian = "pomeranian",
  Poodle = "poodle",
  Pug = "pug",
  Rottweiler = "rottweiler",
  Schnauzer = "schnauzer",
  Scottie = "scottie",
  Setter = "setter",
  Sharpei = "sharpei",
  Sheepdog = "sheepdog",
  Shepherd = "shepherd",
  ShihTzu = "shihTzu",
  Spaniel = "spaniel",
  StBernard = "stBernard",
  TerrierMedLarge = "terrierMedLarge",
  TerrierSmall = "terrierSmall",
  Weimaraner = "weimaraner",
  Whippet = "whippet",
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
