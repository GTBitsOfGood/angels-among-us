import { getPrefFilters, Option, SelectedFilters } from "../../components/Feed/Feed";
import { Role } from "../../utils/types/account";
import { Breed, FosterType, Status } from "../../utils/types/post";
import { IUser } from "../../utils/types/user";

// Function to count the number of filter options
const countFilters = (filters: SelectedFilters | null): number => {
  if (!filters) return 0;

  let count = 0;
  for (const opts of Object.values(filters)) {
    if (!opts) continue;
    count = Array.isArray(opts) ? count + opts.length : count + 1;
  }
  return count;
};

// Function to determine whether two options are equivalent
const isEqual = (a: Option, b: Option): boolean => (
  a.value === b.value && a.label === b.label
);

// Function to 
const checkFilters = (filters: SelectedFilters | null, target: SelectedFilters): boolean => {
  if (!filters) return false;
  return Object.keys(filters).filter((filter) => filter in target).every((f) => (
    filters[f].every((opt) => target[f].some((o) => isEqual(o, opt))
    && filters[f].length === target[f].length
  )));
}

/**
 * Tests ability to use user preferences to propagate feed filters
 */
describe("[Misc] User Preferences - Unit Test", () => {
  const dummyUser: IUser = {
    email: "",
    uid: "",
    role: Role.Volunteer,
    disabled: false,
    hasCompletedOnboarding: true
  }

  test("null userdata", () => {
    const filters = getPrefFilters(null);
    expect(filters).toBeNull();
    expect(countFilters(filters)).toBe(0);
  });

  test("empty userdata", () => {
    // const filters = {
    //   type: [],
    //   breed: [],
    //   age: [],
    //   size: [],
    //   gender: [],
    //   dogsNotGood
    // }
    expect(getPrefFilters(dummyUser));
  });

  test("1 pet type", () => {
    const userData: IUser = {
      ...dummyUser,
      type: [FosterType.Boarding]
    }
    const targetFilters = {
      type: [
        { value: FosterType.Boarding, label: "Boarding" }
      ]
    }
    const filters = getPrefFilters(userData);
    expect(filters).not.toBeNull();
    expect(countFilters(filters)).toBe(1);
    expect(checkFilters(filters, targetFilters)).toBe(true);
  });

  test("2 pet breeds", () => {
    const userData: IUser = {
      ...dummyUser,
      preferredBreeds: [Breed.AmericanEskimo, Breed.Beagle]
    }
    const targetFilters = {
      breed: [
        { value: Breed.AmericanEskimo, label: "American Eskimo" },
        { value: Breed.Beagle, label: "Beagle" }
      ]
    }
    const filters = getPrefFilters(userData);
    expect(filters).not.toBeNull();
    expect(countFilters(filters)).toBe(2);
    expect(checkFilters(filters, targetFilters)).toBe(true);
  });

  test("2 medicalInfo boxes checked (Status.Yes)", () => {
    const userData: IUser = {
      ...dummyUser,
      houseTrained: Status.Yes,
      spayNeuterStatus: Status.Yes
    }
    const targetFilters = {
      medicalInfo: [
        { value: Status.Yes, label: "House Trained" },
        { value: Status.Yes, label: "Spayed/Neutered" }
      ]
    }
    const filters = getPrefFilters(userData);
    expect(filters).not.toBeNull();
    expect(countFilters(filters)).toBe(2);
    expect(checkFilters(filters, targetFilters)).toBe(true);
  });
});