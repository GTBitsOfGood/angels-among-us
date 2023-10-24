import {
  getPrefFilters,
  Option,
  SelectedFilters,
} from "../../components/Feed/Feed";
import { Role } from "../../utils/types/account";
import {
  Breed,
  breedLabels,
  FosterType,
  GoodWith,
  Status,
} from "../../utils/types/post";
import { IUser, SerializedUser } from "../../utils/types/user";

// Mock authentication
jest.mock("../../context/auth", () => ({
  useAuth: jest.fn(),
}));

/**
 * Counts the number of filter options within a SelectedFilters object
 * @param {SelectedFilters} filters object containing filter options
 * @returns {number} number of options
 */
const countFilters = (filters: SelectedFilters | null): number => {
  if (!filters) return 0;

  let count = 0;
  for (const opts of Object.values(filters)) {
    if (!opts) continue;
    count = Array.isArray(opts) ? count + opts.length : count + 1;
  }
  return count;
};

/**
 * Checks whether two options are equivalent
 * @param {Option} a option a
 * @param {Option} b option b
 * @returns {boolean} whether options are equal
 */
const isEqual = (a: Option, b: Option): boolean =>
  a.value === b.value && a.label === b.label;

/**
 * Checks if two objects of filters are equal
 * @param {SelectedFilters | null} filters filters to check
 * @param {SelectedFilters} target  filters to check against
 * @returns {boolean} whether filters are equal
 */
const checkFilters = (
  filters: SelectedFilters | null,
  target: SelectedFilters
): boolean => {
  if (!filters) return false;
  return Object.keys(filters)
    .filter((filter) => filter in target)
    .every((f) =>
      filters[f].every(
        (opt) =>
          target[f].some((o) => isEqual(o, opt)) &&
          filters[f].length === target[f].length
      )
    );
};

/**
 * Tests ability to use user preferences to propagate feed filters
 *
 * @group components/feed
 * @group components
 * @group unit
 */
describe("[Feed] Import User Preferences - Unit Test", () => {
  // Generate user profile baseline that maps to zero feed filter options
  const dummyUser = {
    email: "",
    uid: "",
    role: Role.Volunteer,
    disabled: false,
    hasCompletedOnboarding: true,
    dogsNotGoodWith: Object.values(GoodWith),
    appliedTo: [],
  };

  test("null userdata", () => {
    const filters = getPrefFilters(null);
    expect(filters).toBeNull();
    expect(countFilters(filters)).toBe(0);
  });

  test("empty userdata", () => {
    const filters = getPrefFilters(dummyUser);
    expect(countFilters(filters)).toBe(50);
  });

  test("1 pet type", () => {
    const userData: SerializedUser = {
      ...dummyUser,
      type: [FosterType.Boarding],
    };
    const targetFilters = {
      type: [{ value: FosterType.Boarding, label: "Boarding" }],
    };
    const filters = getPrefFilters(userData);
    expect(filters).not.toBeNull();
    expect(countFilters(filters)).toBe(
      Object.keys(Breed).length + targetFilters.type.length
    );
    expect(checkFilters(filters, targetFilters)).toBe(true);
  });

  test("2 pet breeds", () => {
    const userData: SerializedUser = {
      ...dummyUser,
      restrictedBreeds: [Breed.AmericanEskimo, Breed.Beagle],
    };
    const targetFilters = {
      breed: Object.keys(breedLabels)
        .filter(
          (val: string) => !userData.restrictedBreeds?.includes(val as Breed)
        )
        .map((val) => ({
          value: val as Breed,
          label: breedLabels[val as Breed],
        })),
    };
    const filters = getPrefFilters(userData);
    expect(filters).not.toBeNull();
    expect(countFilters(filters)).toBe(targetFilters.breed.length);
    expect(checkFilters(filters, targetFilters)).toBe(true);
  });

  test("2 dogsNotGoodWith", () => {
    const userData: SerializedUser = {
      ...dummyUser,
      dogsNotGoodWith: [GoodWith.Men, GoodWith.Women],
    };
    const targetFilters = {
      dogsNotGoodWith: [
        { value: GoodWith.OlderChildren, label: "Older Children" },
        { value: GoodWith.YoungChildren, label: "Young Children" },
        { value: GoodWith.LargeDogs, label: "Large Dogs" },
        { value: GoodWith.SmallDogs, label: "Small Dogs" },
        { value: GoodWith.Cats, label: "Cats" },
      ],
    };
    const filters = getPrefFilters(userData);
    expect(filters).not.toBeNull();
    expect(countFilters(filters)).toBe(
      Object.keys(Breed).length + Object.keys(GoodWith).length - 2
    );
    expect(checkFilters(filters, targetFilters)).toBe(true);
  });
});
