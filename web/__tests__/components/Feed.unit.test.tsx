import {
  getPrefFilters,
  QueryFilter,
} from "../../components/FeedPage/FeedPage";
import {
  FilterKeys,
  FilterKeyTypeMap,
  Option,
  TYPE_OPTION_MAP,
} from "../../components/FeedPage/Filter/filterConsts";
import { Role } from "../../utils/types/account";
import {
  Age,
  Behavioral,
  Breed,
  breedLabels,
  FosterType,
  Gender,
  GoodWith,
  Medical,
  Size,
  Status,
} from "../../utils/types/post";
import { IUser } from "../../utils/types/user";

// Mock authentication
jest.mock("../../context/auth", () => ({
  useAuth: jest.fn(),
}));

/**
 * Tests feed filter functionality.
 *
 * @group components/feed
 * @group components
 * @group unit
 */
describe("[Feed] Filter - Unit Test", () => {
  const defaultFeedFilters: QueryFilter = {
    type: Object.values(FosterType),
    breed: Object.values(Breed),
    age: Object.values(Age),
    size: Object.values(Size),
    gender: Object.values(Gender),
    goodWith: [],
    behavioral: Object.values(Behavioral),
  };

  /**
   * Tests ability to use user preferences to propagate feed filters
   *
   * @group components/feed
   * @group components
   * @group unit
   */
  describe("Import user preferences", () => {
    // Generate user profile baseline that maps to zero feed filter options
    const dummyUser = {
      email: "",
      uid: "",
      role: Role.Volunteer,
      disabled: false,
      hasCompletedOnboarding: true,
    };

    const defaultUserFilters = {
      type: Object.values(FosterType),
      size: Object.values(Size),
      restrictedBreeds: [],
      preferredBreeds: [],
      gender: Object.values(Gender),
      age: Object.values(Age),
      dogsNotGoodWith: Object.values(GoodWith),
      medical: Object.values(Medical),
      behavioral: Object.values(Behavioral),
    };

    test("null userdata", () => {
      const filters = getPrefFilters(null);
      expect(filters).toBeNull();
    });

    test("default userData", () => {
      const filters = getPrefFilters({ ...dummyUser, ...defaultUserFilters });
      expect(filters).toEqual(defaultFeedFilters);
    });

    test("1 pet type", () => {
      const userData: IUser = {
        ...dummyUser,
        ...defaultUserFilters,
        type: [FosterType.Boarding],
      };
      const targetFilters = {
        ...defaultFeedFilters,
        type: [FosterType.Boarding],
      };
      const filters = getPrefFilters(userData);
      expect(filters).not.toBeNull();
      expect(filters).toEqual(targetFilters);
    });

    test("2 pet breeds", () => {
      const userData: IUser = {
        ...dummyUser,
        ...defaultUserFilters,
        restrictedBreeds: [Breed.AmericanEskimo, Breed.Beagle],
      };
      const targetFilters = {
        ...defaultFeedFilters,
        breed: Object.keys(breedLabels).filter(
          (val: string) => !userData.restrictedBreeds?.includes(val as Breed)
        ),
      };
      const filters = getPrefFilters(userData);
      expect(filters).not.toBeNull();
      expect(filters).toEqual(targetFilters);
    });

    test("2 dogsNotGoodWith", () => {
      const goodWithArr = [GoodWith.Men, GoodWith.Women];
      const userData: IUser = {
        ...dummyUser,
        ...defaultUserFilters,
        dogsNotGoodWith: goodWithArr,
      };
      const targetFilters = {
        ...defaultFeedFilters,
        goodWith: Object.values(GoodWith).filter(
          (val) => !goodWithArr.includes(val)
        ),
      };
      const filters = getPrefFilters(userData);
      expect(filters).not.toBeNull();
      expect(filters).toEqual(targetFilters);
    });
  });
});
