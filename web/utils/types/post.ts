export enum PetKind {
  Dog = "dog",
  Cat = "cat",
}

export const petKindLabels: Record<PetKind, string> = {
  [PetKind.Dog]: "Dog",
  [PetKind.Cat]: "Cat",
};

export enum FosterType {
  Return = "return",
  Boarding = "boarding",
  Temporary = "temporary",
  FosterMove = "fosterMove",
  OwnerSurrender = "ownerSurrender",
  Shelter = "shelter",
}

export const fosterTypeLabels: Record<FosterType, string> = {
  [FosterType.Return]: "Return",
  [FosterType.Boarding]: "Boarding",
  [FosterType.Temporary]: "Temporary",
  [FosterType.FosterMove]: "Foster move",
  [FosterType.OwnerSurrender]: "Owner surrender",
  [FosterType.Shelter]: "Shelter",
};

export enum Size {
  XS = "xs",
  S = "s",
  M = "m",
  L = "l",
  XL = "xl",
}

export const sizeLabels: Record<Size, string> = {
  [Size.XS]: "XS",
  [Size.S]: "S",
  [Size.M]: "M",
  [Size.L]: "L",
  [Size.XL]: "XL",
};

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

export const breedLabels: Record<Breed, string> = {
  [Breed.AmericanEskimo]: "American Eskimo", // American Eskimo
  [Breed.AustralianShepherd]: "Australian Shepherd", // Australian Shepherd
  [Breed.Beagle]: "Beagle",
  [Breed.BichonFrise]: "Bichon Frise", // Bichon Frise
  [Breed.BorderCollie]: "Border Collie", // Border Collie
  [Breed.Boxer]: "Boxer",
  [Breed.BrusselsGriffon]: "Brussels Griffon", // Brussels Griffon
  [Breed.Bulldog]: "Bulldog",
  [Breed.CaneCorsoMastiff]: "Cane Corso/Mastiff", // Cane Corso/Mastiff
  [Breed.CattleDogHeeler]: "Cattle Dog/Heeler", // Cattle Dog/Heeler
  [Breed.Chihuahua]: "Chihuahua",
  [Breed.ChowChow]: "Chow Chow", // Chow Chow
  [Breed.Collie]: "Collie",
  [Breed.Corgi]: "Corgi",
  [Breed.Dachshund]: "Dachshund",
  [Breed.Dalmatian]: "Dalmatian",
  [Breed.DobermanPinscher]: "Doberman Pinscher", // Doberman Pinscher
  [Breed.GermanShepherd]: "German Shepherd", // German Shepherd
  [Breed.GoldenRetriever]: "Golden Retriever", // Golden Retriever
  [Breed.GreatDane]: "Great Dane", // Great Dane
  [Breed.GreatPyrenees]: "Great Pyrenees", // Great Pyrenees
  [Breed.Greyhound]: "Greyhound",
  [Breed.Hound]: "Hound",
  [Breed.Husky]: "Husky",
  [Breed.LabradorRetriever]: "Labrador Retriever", // Labrador Retriever
  [Breed.Malamute]: "Malamute",
  [Breed.Maltese]: "Maltese",
  [Breed.MinPin]: "Min Pin", // Min Pin
  [Breed.Mix]: "Mix",
  [Breed.Newfoundland]: "Newfoundland",
  [Breed.Pekingese]: "Pekingese",
  [Breed.Pitbull]: "Pitbull",
  [Breed.Pointer]: "Pointer",
  [Breed.Pomeranian]: "Pomeranian",
  [Breed.Poodle]: "Poodle",
  [Breed.Pug]: "Pug",
  [Breed.Rottweiler]: "Rottweiler",
  [Breed.Schnauzer]: "Schnauzer",
  [Breed.Scottie]: "Scottie",
  [Breed.Setter]: "Setter",
  [Breed.Sharpei]: "Sharpei",
  [Breed.Sheepdog]: "Sheepdog",
  [Breed.Shepherd]: "Shepherd",
  [Breed.ShihTzu]: "Shih Tzu", // Shih Tzu
  [Breed.Spaniel]: "Spaniel",
  [Breed.StBernard]: "St. Bernard", // St. Bernard
  [Breed.TerrierMedLarge]: "Terrier (Med-Large)", // Terrier (Med-Large)
  [Breed.TerrierSmall]: "Terrier (Small)", // Terrier (Small)
  [Breed.Weimaraner]: "Weimaraner",
  [Breed.Whippet]: "Whippet",
};

export enum Gender {
  Male = "male",
  Female = "female",
  Litter = "litter",
}

export const genderLabels: Record<Gender, string> = {
  [Gender.Male]: "Male",
  [Gender.Female]: "Female",
  [Gender.Litter]: "Litter",
};

export enum Age {
  Puppy = "puppy",
  Young = "young",
  Adult = "adult",
  Senior = "senior",
  MomAndPuppies = "momAndPuppies",
}

export const ageLabels: Record<Age, string> = {
  [Age.Puppy]: "Puppy",
  [Age.Young]: "Young",
  [Age.Adult]: "Adult",
  [Age.Senior]: "Senior",
  [Age.MomAndPuppies]: "Mom and puppies",
};

export enum Temperament {
  Friendly = "friendly",
  Scared = "scared",
  Active = "active",
  Calm = "calm",
}

export const temperamentLabels: Record<Temperament, string> = {
  [Temperament.Friendly]: "Friendly",
  [Temperament.Scared]: "Scared",
  [Temperament.Active]: "Active",
  [Temperament.Calm]: "Calm",
};

export enum GoodWith {
  Men = "men",
  Women = "women",
  OlderChildren = "olderChildren",
  YoungChildren = "youngChildren",
  LargeDogs = "largeDogs",
  SmallDogs = "smallDogs",
  Cats = "cats",
}

export const goodWithLabels: Record<GoodWith, string> = {
  [GoodWith.Men]: "Men",
  [GoodWith.Women]: "Women",
  [GoodWith.OlderChildren]: "Older children",
  [GoodWith.YoungChildren]: "Young children",
  [GoodWith.LargeDogs]: "Large dogs",
  [GoodWith.SmallDogs]: "Small dogs",
  [GoodWith.Cats]: "Cats",
};

export enum Medical {
  Illness = "illness",
  Injury = "injury",
  Heartworms = "heartworms",
  Parvo = "parvo",
  ChronicCondition = "chronicCondition",
  Pregnant = "pregnant",
  Nursing = "nursing",
  BottleFed = "bottleFed",
  Hospice = "hospice",
}

export const medicalLabels: Record<Medical, string> = {
  [Medical.Illness]: "Illness",
  [Medical.Injury]: "Injury",
  [Medical.Heartworms]: "Heartworms",
  [Medical.Parvo]: "Parvo",
  [Medical.ChronicCondition]: "Chronic condition",
  [Medical.Pregnant]: "Pregnant",
  [Medical.Nursing]: "Nursing",
  [Medical.BottleFed]: "Bottle fed",
  [Medical.Hospice]: "Hospice",
};

export enum Behavioral {
  SeparationAnxiety = "separationAnxiety",
  Barking = "barking",
  Jumping = "jumping",
  FlightRisk = "flightRisk",
  BiteRisk = "biteRisk",
  PullsOnLeash = "pullsOnLeash",
}

export const behavioralLabels: Record<Behavioral, string> = {
  [Behavioral.SeparationAnxiety]: "Separation anxiety",
  [Behavioral.Barking]: "Barking",
  [Behavioral.Jumping]: "Jumping",
  [Behavioral.FlightRisk]: "Flight risk",
  [Behavioral.BiteRisk]: "Bite risk",
  [Behavioral.PullsOnLeash]: "Pulls on leash",
};

export enum Trained {
  Yes = "yes",
  No = "no",
  Unknown = "unknown",
}

export const trainedLabels: Record<Trained, string> = {
  [Trained.Yes]: "Yes",
  [Trained.No]: "No",
  [Trained.Unknown]: "Unknown",
};

export enum Status {
  Yes = "yes",
  No = "no",
}

export const statusLabels: Record<Status, string> = {
  [Trained.Yes]: "Yes",
  [Trained.No]: "No",
};

export type AttachmentInfo =
  | { type: "image"; key: string; length: number; width: number }
  | { type: "video"; key: string };

export interface IPost {
  date: Date;
  type: FosterType;
  size: Size;
  breed: Breed[];
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
