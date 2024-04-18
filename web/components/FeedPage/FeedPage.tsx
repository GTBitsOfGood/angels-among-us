import {
  Button,
  Flex,
  Text,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import { useCallback, useMemo, useState } from "react";
import { useAuth } from "../../context/auth";
import { trpc } from "../../utils/trpc";
import { Role } from "../../utils/types/account";
import {
  Age,
  Behavioral,
  Breed,
  FosterType,
  Gender,
  GoodWith,
  Size,
} from "../../utils/types/post";
import {
  Option,
  filterGroups,
  AGE_OPTION_MAP,
  GENDER_OPTION_MAP,
  FilterKeys,
  FilterKeyTypeMap,
  TYPE_OPTION_MAP,
  BREED_OPTION_MAP,
  SIZE_OPTION_MAP,
  BEHAVIORAL_OPTION_MAP,
  GOOD_WITH_OPTION_MAP,
} from "./Filter/filterConsts";
import { IUser } from "../../utils/types/user";
import PostCreationModal from "../PostCreationModal/PostCreationModal";
import useDebounce from "../../hooks/useDebounce";
import FeedCoveredDropdown from "./CoveredDropdown";
import {
  useQueryParams,
  ArrayParam,
  BooleanParam,
  withDefault,
} from "use-query-params";
import { z } from "zod";
import FeedSection from "./Feed/FeedSection";
import FilterSection from "./Filter/FilterSection";
import { getAnalyticsLogger } from "../../utils/analytics-logger";

type OptHandlers = {
  [K in FilterKeys]: OptHandler<FilterKeyTypeMap[K]>;
};

export type QueryFilter = {
  [K in FilterKeys]: FilterKeyTypeMap[K][];
};

type FilterAPIInput = {
  postFilters: QueryFilter;
  covered?: boolean;
  draft?: boolean;
};

type OptHandler<T extends FilterKeyTypeMap[FilterKeys]> = (
  opts: Option<T>[]
) => T[];

/**
 * Defines transformation for user preferences array of enums into
 * a format usable for feed (query params)
 * @param {Option<T>[]} opts array of all possible options
 * @param {T[]} userPreferencefArr array of filter option enums
 * @param {boolean} inverse whether to invert the user preferences
 * @returns {T[]} enums array
 */
function parseOptArr<T extends FilterKeyTypeMap[FilterKeys]>(
  opts: Option<T>[],
  userPreferenceArr: T[] | undefined,
  inverse: boolean = false
): T[] {
  return inverse
    ? [
      ...opts
        .filter((f) => !userPreferenceArr?.includes(f.value))
        .map((option) => option.value),
    ]
    : [
      ...opts
        .filter((f) => userPreferenceArr?.includes(f.value))
        .map((option) => option.value),
    ];
}

/**
 * Imports user preferences and maps them to the feed filters
 * @param {IUser | null} userData user data
 * @returns {QueryFilter | null} preferred filters
 */
function getPrefFilters(userData: IUser | null): QueryFilter | null {
  if (!userData) {
    return null;
  }

  const optHandlers: OptHandlers = {
    type: (opts: Option<FosterType>[]) =>
      parseOptArr<FosterType>(opts, userData.type),
    breed: (opts: Option<Breed>[]) =>
      parseOptArr(opts, userData.restrictedBreeds, true),
    age: (opts: Option<Age>[]) => parseOptArr(opts, userData.age),
    size: (opts: Option<Size>[]) => parseOptArr(opts, userData.size),
    gender: (opts: Option<Gender>[]) => parseOptArr(opts, userData.gender),
    goodWith: (opts: Option<GoodWith>[]) =>
      parseOptArr(opts, userData.dogsNotGoodWith, true),
    behavioral: (opts: Option<Behavioral>[]) =>
      parseOptArr(opts, userData.behavioral),
  };

  const filters = filterGroups.reduce((acc, curr) => {
    const group = curr.filters.reduce((a, c) => {
      return {
        ...a,
        [c.key]: optHandlers[c.key](c.options as Option<any>[]), // TypeScript refuses to accept Option<FilterKeyTypeMap[FilterKeys]>[]
      };
    }, {});
    return {
      ...acc,
      ...group,
    };
  }, {});
  return filters as QueryFilter;
}

function generatePreprocessAndTransformSchema<
  T extends FilterKeyTypeMap[FilterKeys]
>(nativeEnum: any, optionMap: Record<T, string>) {
  return z
    .preprocess(
      (val) => (val as string[]).filter((param) => param in optionMap),
      z.array(z.nativeEnum(nativeEnum))
    )
    .transform((val) => Array.from(new Set(val)));
}

export const postFilterSchema = z.object({
  type: generatePreprocessAndTransformSchema<FosterType>(
    FosterType,
    TYPE_OPTION_MAP
  ),
  breed: generatePreprocessAndTransformSchema(Breed, BREED_OPTION_MAP),
  age: generatePreprocessAndTransformSchema(Age, AGE_OPTION_MAP),
  size: generatePreprocessAndTransformSchema(Size, SIZE_OPTION_MAP),
  gender: generatePreprocessAndTransformSchema(Gender, GENDER_OPTION_MAP),
  goodWith: generatePreprocessAndTransformSchema(
    GoodWith,
    GOOD_WITH_OPTION_MAP
  ),
  behavioral: generatePreprocessAndTransformSchema(
    Behavioral,
    BEHAVIORAL_OPTION_MAP
  ),
});

const feedFilterSchema = postFilterSchema.merge(
  z.object({
    covered: z.optional(z.boolean()),
    draft: z.optional(z.boolean()),
  })
);

type ResetAction = {
  type: "reset";
};

type ProfileFillAction = {
  type: "profileFill";
};

type CheckboxChangeAction<T extends FilterKeys> = {
  type: "checkboxChange";
  key: T;
  value: FilterKeyTypeMap[T];
  operation: "push" | "pull";
};

type DropdownChangeAction<T extends FilterKeys> = {
  type: "dropdownChange";
  key: T;
  value: FilterKeyTypeMap[T][] | "";
};

export type HandleFilterChangeActions =
  | ResetAction
  | ProfileFillAction
  | CheckboxChangeAction<FilterKeys>
  | DropdownChangeAction<FilterKeys>;

/**
 * Transforms `query` into QueryFilters to match API `postFilters` input.
 * `covered` field excluded as it will only
 * @param query parameters from URL
 * @returns query filters used to send shaped to the API input
 */
function parseFeedFilter(query: Record<string, any>): FilterAPIInput {
  const result = feedFilterSchema.safeParse(query);
  if (!result.success) {
    throw new Error("Could not parse URL");
  }
  const { covered, draft, ...postFilters } = result.data;
  return { covered, draft, postFilters };
}

const defaultQueryParams = {
  type: withDefault(ArrayParam, Object.keys(TYPE_OPTION_MAP)),
  breed: withDefault(ArrayParam, Object.keys(BREED_OPTION_MAP)),
  age: withDefault(ArrayParam, Object.keys(AGE_OPTION_MAP)),
  size: withDefault(ArrayParam, Object.keys(SIZE_OPTION_MAP)),
  gender: withDefault(ArrayParam, Object.keys(GENDER_OPTION_MAP)),
  goodWith: withDefault(ArrayParam, []),
  behavioral: withDefault(ArrayParam, Object.keys(BEHAVIORAL_OPTION_MAP)),
  covered: withDefault(BooleanParam, undefined),
  draft: withDefault(BooleanParam, undefined),
};

function FeedPage() {
  const {
    isOpen: isPostCreationOpen,
    onOpen: onPostCreationOpen,
    onClose: onPostCreationClose,
  } = useDisclosure();

  const { userData } = useAuth();
  const role = userData?.role;

  const [isSmallerThanLg] = useMediaQuery("(max-width: 62em)");
  const [isMobileFilterDisplayed, setIsMobileFilterDisplayed] = useState(false);

  const [query, setQuery] = useQueryParams(defaultQueryParams);

  const validatedFilters = useMemo(() => {
    const parsedFilters = parseFeedFilter(query);
    ``;
    return {
      postFilters: parsedFilters.postFilters,
      covered:
        role === Role.Volunteer ? false : parsedFilters.covered ?? undefined,
      draft: role === Role.Volunteer ? false : parsedFilters.draft ?? undefined,
    };
  }, [query]);

  const [debouncedFilters, isUpdating] = useDebounce<typeof validatedFilters>(
    validatedFilters,
    400
  );

  const { data: feedPosts, isLoading } =
    trpc.post.getFilteredPosts.useQuery(debouncedFilters);
  /**
   * Handles all changes to filter state, except for `covered`. This includes
   * option selection/deselection, dropdown modifications, reset,
   * and filling from profile.
   */
  const handleFilterChange = useCallback(
    (action: HandleFilterChangeActions) => {
      const logger = getAnalyticsLogger();
      switch (action.type) {
        case "reset":
          setQuery({}, "replace");
          break;
        case "checkboxChange":
          logger.logClickEvent({
            objectId: `filter_${action.key}`,
            userId: (Math.random() + 1).toString(36).substring(7), // random uuid
          });
          let newParams: FilterKeyTypeMap[FilterKeys][] | "";
          if (action.operation === "push") {
            newParams = [
              ...validatedFilters.postFilters[action.key],
              action.value,
            ];
          } else {
            newParams = (
              validatedFilters.postFilters[
              action.key
              ] as FilterKeyTypeMap[FilterKeys][]
            ).filter((val) => val !== action.value);
          }

          if (newParams.length === 0) {
            newParams = "";
          }
          setQuery({
            [action.key]: newParams,
          });
          break;
        case "dropdownChange":
          setQuery({
            [action.key]: action.value,
          });
          break;
        case "profileFill":
          setQuery(getPrefFilters(userData) ?? {}, "replace");
          break;
      }
    },
    [validatedFilters]
  );

  function handleCoveredChange(
    covered: boolean | undefined,
    draft: boolean | undefined
  ) {
    setQuery({
      covered: covered,
      draft: draft,
    });
  }

  const Dropdown = () => {
    return (
      <FeedCoveredDropdown
        displayCovered={validatedFilters.covered}
        displayDraft={validatedFilters.draft}
        handleCoveredChange={handleCoveredChange}
      />
    );
  };

  return (
    <Flex
      bgColor={{ base: "white", lg: "bg-primary" }}
      flexDir={{ base: "column", lg: "row" }}
      w="100%"
      h="100%"
      justifyContent={{ base: "inherit", lg: "center" }}
      alignItems={{ base: "center", lg: "inherit" }}
      pt={{ base: 20, lg: 100 }}
      px={{ base: 4, lg: 8 }}
      pb={{ base: 0, lg: 50 }}
    >
      <Flex
        display={{ base: "flex", lg: "none" }}
        w="100%"
        direction="column"
        pb={4}
      >
        <Flex w="100%" direction="row" justifyContent="space-between">
          <Flex gap={2} w="100%" display={{ base: "flex", lg: "none" }}>
            <Text fontWeight="bold" fontSize="20px" pr={3}>
              {isMobileFilterDisplayed && isSmallerThanLg
                ? "Filter By:"
                : "Latest Posts"}
            </Text>
            <Flex
              display={{
                base: "none",
                md:
                  role === Role.Admin || role === Role.ContentCreator
                    ? "flex"
                    : "none",
              }}
            >
              <Dropdown />
            </Flex>
          </Flex>
          <Button
            display={{ base: "flex", lg: "none" }}
            variant={
              isMobileFilterDisplayed ? "outline-secondary" : "solid-primary"
            }
            onClick={() => {
              setIsMobileFilterDisplayed(!isMobileFilterDisplayed);
            }}
            height="36px"
            borderRadius="10px"
          >
            {isMobileFilterDisplayed ? "Close" : "Filter By"}
          </Button>
        </Flex>
        <Flex
          w="100%"
          display={{ base: "flex", md: "none" }}
          justifyContent="start"
        >
          <Dropdown />
        </Flex>
      </Flex>
      <Flex
        w="100%"
        h="100%"
        overflow="hidden"
        justifyContent="center"
        gap={30}
      >
        <FilterSection
          isMobileFilterDisplayed={isMobileFilterDisplayed}
          handleFilterChange={handleFilterChange}
          postFilterState={validatedFilters.postFilters}
        />
        {!(isSmallerThanLg && isMobileFilterDisplayed) ? (
          <FeedSection
            isLoading={isUpdating || isLoading}
            coveredState={validatedFilters.covered}
            draftState={validatedFilters.draft}
            handleCoveredChange={handleCoveredChange}
            onPostCreationOpen={onPostCreationOpen}
            feedPosts={feedPosts}
          />
        ) : null}
      </Flex>
      <PostCreationModal
        isOpen={isPostCreationOpen}
        onClose={onPostCreationClose}
      />
    </Flex>
  );
}

export default FeedPage;
export { getPrefFilters };
