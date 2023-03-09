export enum FosterType {
  Return = "return",
  Boarding = "boarding",
  Temporary = "temporary",
  FosterMove = "fosterMove",
  OwnerSurrender = "ownerSurrender",
  Shelter = "shelter",
}

export enum Size {
  XS = "xs",
  S = "s",
  M = "m",
  L = "l",
  XL = "xl",
}

export enum Breed {
  AmericanEskimo = "americanEskimo", // American Eskimo
  AustralianShepherd = "australianShepherd", // Australian Shepherd
  Beagle = "beagle",
  BichonFrise = "bichonFrise", // Bichon Frise
  BorderCollie = "borderCollie", // Border Collie
  Boxer = "boxer",
  BrusselsGriffon = "brusselsGriffon", // Brussels Griffon
  Bulldog = "bulldog",
  CaneCorsoMastiff = "caneCorsoMastiff", // Cane Corso/Mastiff
  CattleDogHeeler = "cattleDogHeeler", // Cattle Dog/Heeler
  Chihuahua = "chihuahua",
  ChowChow = "chowChow", // Chow Chow
  Collie = "collie",
  Corgi = "corgi",
  Dachshund = "dachshund",
  Dalmatian = "dalmatian",
  DobermanPinscher = "dobermanPinscher", // Doberman Pinscher
  GermanShepherd = "germanShepherd", // German Shepherd
  GoldenRetriever = "goldenRetriever", // Golden Retriever
  GreatDane = "greatDane", // Great Dane
  GreatPyrenees = "greatPyrenees", // Great Pyrenees
  Greyhound = "greyhound",
  Hound = "hound",
  Husky = "husky",
  LabradorRetriever = "labradorRetriever", // Labrador Retriever
  Malamute = "malamute",
  Maltese = "maltese",
  MinPin = "minPin", // Min Pin
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
  ShihTzu = "shihTzu", // Shih Tzu
  Spaniel = "spaniel",
  StBernard = "stBernard", // St. Bernard
  TerrierMedLarge = "terrierMedLarge", // Terrier (Med-Large)
  TerrierSmall = "terrierSmall", // Terrier (Small)
  Weimaraner = "weimaraner",
  Whippet = "whippet",
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

export type AttachmentInfo =
  | { type: "image"; key: string; length: number; width: number }
  | { type: "video"; key: string };

export interface IPost {
  date: Date;
  type: FosterType;
  size: Size;
  breed: Breed;
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
  pending: boolean;
  attachments: string[];
}

export type IPendingPost = Omit<IPost, "attachments" | "pending"> & {
  attachments: AttachmentInfo[];
};
