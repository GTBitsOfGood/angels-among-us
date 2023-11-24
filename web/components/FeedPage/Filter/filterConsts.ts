import { PossibleTypes } from "../../../pages/onboarding";
import {
  Breed,
  FosterType,
  Age,
  Size,
  Gender,
  Behavioral,
  GoodWith,
  fosterTypeLabels,
  breedLabels,
  ageLabels,
  genderLabels,
  sizeLabels,
  goodWithLabels,
  behavioralLabels,
} from "../../../utils/types/post";

export type FilterKeys =
  | typeof TYPE_KEY
  | typeof BREED_KEY
  | typeof AGE_KEY
  | typeof SIZE_KEY
  | typeof GENDER_KEY
  | typeof GOOD_WITH_KEY
  | typeof BEHAVIORAL_KEY;

export type Option<T> = {
  value: T;
  label: string;
};

export type Filter<T extends FilterKeys> = {
  key: T;
  description: string;
  options: Option<FilterKeyTypeMap[T]>[];
  dropdown: boolean;
  allSelected: boolean;
};

function convertOptionMapToArray<T extends PossibleTypes>(
  optionMap: Record<T, string>
): Option<T>[] {
  return Object.entries(optionMap).map(([k, v]) => ({
    value: k as T,
    label: v as string,
  }));
}

const TYPE_KEY = "type";
const TYPE_DESCRIPTION = "Which types of fosters can you help with?";
const TYPE_OPTION_MAP: Record<FosterType, string> = fosterTypeLabels;
const TYPE_FILTER: Filter<typeof TYPE_KEY> = {
  key: TYPE_KEY,
  description: TYPE_DESCRIPTION,
  options: convertOptionMapToArray(TYPE_OPTION_MAP),
  dropdown: false,
  allSelected: true,
};

const BREED_KEY = "breed";
const BREED_DESCRIPTION = "Breeds";
const BREED_OPTION_MAP: Record<Breed, string> = breedLabels;
const BREED_FILTER: Filter<typeof BREED_KEY> = {
  key: BREED_KEY,
  description: BREED_DESCRIPTION,
  options: convertOptionMapToArray(BREED_OPTION_MAP),
  dropdown: true,
  allSelected: true,
};

const AGE_KEY = "age";
const AGE_DESCRIPTION = "Age";
const AGE_OPTION_MAP: Record<Age, string> = ageLabels;
const AGE_FILTER: Filter<typeof AGE_KEY> = {
  key: AGE_KEY,
  description: AGE_DESCRIPTION,
  options: convertOptionMapToArray(AGE_OPTION_MAP),
  dropdown: false,
  allSelected: true,
};

const SIZE_KEY = "size";
const SIZE_DESCRIPTION = "Size";
const SIZE_OPTION_MAP: Record<Size, string> = sizeLabels;
const SIZE_FILTER: Filter<typeof SIZE_KEY> = {
  key: SIZE_KEY,
  description: SIZE_DESCRIPTION,
  options: convertOptionMapToArray(SIZE_OPTION_MAP),
  dropdown: false,
  allSelected: true,
};

const GENDER_KEY = "gender";
const GENDER_DESCRIPTION = "Gender";
const GENDER_OPTION_MAP: Record<Gender, string> = genderLabels;
const GENDER_FILTER: Filter<typeof GENDER_KEY> = {
  key: GENDER_KEY,
  description: GENDER_DESCRIPTION,
  options: convertOptionMapToArray(GENDER_OPTION_MAP),
  dropdown: false,
  allSelected: true,
};

const GOOD_WITH_KEY = "goodWith";
const GOOD_WITH_DESCRIPTION = "Dogs known to be good with:";
const GOOD_WITH_OPTION_MAP: Record<GoodWith, string> = goodWithLabels;
const GOOD_WITH_FILTER: Filter<typeof GOOD_WITH_KEY> = {
  key: GOOD_WITH_KEY,
  description: GOOD_WITH_DESCRIPTION,
  options: convertOptionMapToArray(GOOD_WITH_OPTION_MAP),
  dropdown: false,
  allSelected: false,
};

const BEHAVIORAL_KEY = "behavioral";
const BEHAVIORAL_DESCRIPTION = "Able to foster dogs with:";
const BEHAVIORAL_OPTION_MAP: Record<Behavioral, string> = behavioralLabels;
const BEHAVIORAL_FILTER: Filter<typeof BEHAVIORAL_KEY> = {
  key: BEHAVIORAL_KEY,
  description: BEHAVIORAL_DESCRIPTION,
  options: convertOptionMapToArray(BEHAVIORAL_OPTION_MAP),
  dropdown: false,
  allSelected: true,
};

export type FilterKeyTypeMap = {
  [TYPE_KEY]: FosterType;
  [BREED_KEY]: Breed;
  [AGE_KEY]: Age;
  [SIZE_KEY]: Size;
  [GENDER_KEY]: Gender;
  [GOOD_WITH_KEY]: GoodWith;
  [BEHAVIORAL_KEY]: Behavioral;
};

export type FilterGroup = {
  title: string;
  filters: Filter<FilterKeys>[];
};
const GENERAL_INFORMATION_GROUP: FilterGroup = {
  title: "General Information",
  filters: [TYPE_FILTER],
};

const PHYSICAL_TRAITS_GROUP: FilterGroup = {
  title: "Physical Traits",
  filters: [BREED_FILTER, AGE_FILTER, SIZE_FILTER, GENDER_FILTER],
};

const BEHAVIORAL_TRAITS_GROUP: FilterGroup = {
  title: "Behavioral Traits",
  filters: [GOOD_WITH_FILTER, BEHAVIORAL_FILTER],
};

export const filterGroups: FilterGroup[] = [
  GENERAL_INFORMATION_GROUP,
  PHYSICAL_TRAITS_GROUP,
  BEHAVIORAL_TRAITS_GROUP,
];

export {
  TYPE_OPTION_MAP,
  AGE_OPTION_MAP,
  SIZE_OPTION_MAP,
  BREED_OPTION_MAP,
  GENDER_OPTION_MAP,
  GOOD_WITH_OPTION_MAP,
  BEHAVIORAL_OPTION_MAP,
};
