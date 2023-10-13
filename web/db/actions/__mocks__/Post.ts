import { faker } from "@faker-js/faker";
import {
  Age,
  Behavioral,
  Breed,
  FosterType,
  Gender,
  IPendingPost,
  Medical,
  PetKind,
  Size,
  Temperament,
  Trained,
} from "../../../utils/types/post";

export function createRandomPost(): IPendingPost {
  return {
    date: faker.date.past(),
    name: faker.person.fullName(),
    description: faker.lorem.sentence(),
    petKind: faker.helpers.arrayElement(Object.values(PetKind)),
    type: faker.helpers.arrayElement(Object.values(FosterType)),
    size: faker.helpers.arrayElement(Object.values(Size)),
    breed: faker.helpers.uniqueArray(
      Object.values(Breed),
      Math.floor(Math.random() * 5) + 1
    ),
    gender: faker.helpers.arrayElement(Object.values(Gender)),
    age: faker.helpers.arrayElement(Object.values(Age)),
    temperament: faker.helpers.uniqueArray(
      Object.values(Temperament),
      Math.floor(Math.random() * 4) + 1
    ),
    medical: faker.helpers.uniqueArray(
      Object.values(Medical),
      Math.floor(Math.random() * 9) + 1
    ),
    behavioral: faker.helpers.uniqueArray(
      Object.values(Behavioral),
      Math.floor(Math.random() * 6) + 1
    ),
    houseTrained: faker.helpers.arrayElement(Object.values(Trained)),
    crateTrained: faker.helpers.arrayElement(Object.values(Trained)),
    spayNeuterStatus: faker.helpers.arrayElement(Object.values(Trained)),
    getsAlongWithMen: faker.helpers.arrayElement(Object.values(Trained)),
    getsAlongWithWomen: faker.helpers.arrayElement(Object.values(Trained)),
    getsAlongWithOlderKids: faker.helpers.arrayElement(Object.values(Trained)),
    getsAlongWithYoungKids: faker.helpers.arrayElement(Object.values(Trained)),
    getsAlongWithLargeDogs: faker.helpers.arrayElement(Object.values(Trained)),
    getsAlongWithSmallDogs: faker.helpers.arrayElement(Object.values(Trained)),
    getsAlongWithCats: faker.helpers.arrayElement(Object.values(Trained)),
    covered: faker.datatype.boolean(),
    attachments: [],
  };
}
