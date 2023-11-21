import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  Center,
  Flex,
  Spinner,
  Stack,
  Text,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import { Dispatch, SetStateAction, useCallback, useMemo } from "react";
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
} from "./filterConsts";
import { IUser } from "../../utils/types/user";
import PostCreationModal from "../PostCreationModal/PostCreationModal";
import FeedFilterGroup from "./FeedFilterGroup";
import FeedPostCard from "./FeedPostCard";
import useDebounce from "../../hooks/useDebounce";
import FeedCoveredDropdown from "./FeedCoveredDropdown";
import {
  useQueryParams,
  ArrayParam,
  BooleanParam,
  withDefault,
} from "use-query-params";
import { z } from "zod";
import Link from "next/link";

type OptHandlers = {
  [K in FilterKeys]: OptHandler<FilterKeyTypeMap[K]>;
};

export type QueryFilter = {
  [K in FilterKeys]: FilterKeyTypeMap[K][];
};

type FilterAPIInput = {
  postFilters: QueryFilter;
  covered?: boolean;
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
  const { covered, ...postFilters } = result.data;
  return { covered, postFilters };
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
};

function Feed(props: {
  filterDisplayed: boolean;
  setFilterDisplayed: Dispatch<SetStateAction<boolean>>;
}) {
  let { filterDisplayed, setFilterDisplayed } = props;

  const {
    isOpen: isPostCreationOpen,
    onOpen: onPostCreationOpen,
    onClose: onPostCreationClose,
  } = useDisclosure();

  const { userData } = useAuth();
  const role = userData?.role;

  const [isSmallerThanLg] = useMediaQuery("(max-width: 62em)");

  const [query, setQuery] = useQueryParams(defaultQueryParams);

  const validatedFilters = useMemo(() => {
    const parsedFilters = parseFeedFilter(query);
    return {
      postFilters: parsedFilters.postFilters,
      covered:
        role === Role.Volunteer ? false : parsedFilters.covered ?? undefined,
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
      switch (action.type) {
        case "reset":
          setQuery({}, "replace");
          break;
        case "checkboxChange":
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

  function handleCoveredChange(newVal: boolean | undefined) {
    setQuery({
      covered: newVal,
    });
  }

  const filter = (
    <Flex
      display={{ base: "flex", lg: "none" }}
      direction="column"
      width="100%"
      padding="0px"
    >
      <Flex marginTop="0px" gap="8px" w="100%" paddingY={{ base: 5, lg: 0 }}>
        <Button
          w="100%"
          variant="outline-secondary"
          onClick={() => {
            handleFilterChange({
              type: "reset",
            });
          }}
        >
          Clear All
        </Button>
        <Button
          w="100%"
          onClick={() => {
            handleFilterChange({
              type: "profileFill",
            });
          }}
          variant="solid-primary"
        >
          Fill From Profile
        </Button>
      </Flex>
      <Flex direction="column">
        {filterGroups.map((val) => {
          return (
            <FeedFilterGroup
              key={val.title}
              filterGroup={val}
              selectedFilters={validatedFilters.postFilters}
              handleFilterChange={handleFilterChange}
            />
          );
        })}
      </Flex>
    </Flex>
  );

  const MediaContextualizedFeedAndFilter = () => {
    if (filterDisplayed && isSmallerThanLg) {
      return filter;
    }

    if (feedPosts && feedPosts.length > 0) {
      return (
        <Stack overflowY="auto" spacing={0} w="100%" mt={4}>
          {feedPosts!.map((p) => {
            return (
              <Link key={p._id.toString()} href={`/post/${p._id.toString()}`}>
                <FeedPostCard post={p} />
              </Link>
            );
          })}
        </Stack>
      );
    }
    return (
      <Center width="100%" marginTop={"5vh"}>
        <Text>No results found.</Text>
      </Center>
    );
  };

  return (
    <Flex
      className="feed"
      backgroundColor={{ base: "white", lg: "bg-primary" }}
      justifyContent="center"
      height="100dvh"
    >
      <Stack
        spacing={{ base: "0px", lg: "30px" }}
        marginTop={{
          base: document.getElementById("navbar")?.offsetHeight + "px",
          lg: "100px",
        }}
        marginBottom={{ base: "0px", lg: "50px" }}
        direction={{ base: "column", lg: "row" }}
        flex={{ base: "1", lg: "0" }}
      >
        <Flex
          width="25vw"
          borderRadius="10px"
          backgroundColor="white"
          direction="column"
          display={{ base: "none", lg: "flex" }}
          overflowY="auto"
        >
          <Text fontWeight="semibold" margin="16px">
            Filter By:
          </Text>
          <Flex
            direction="column"
            justifyContent="flex-end"
            margin="12px"
            gap="8px"
          >
            <Button
              variant="outline-secondary"
              onClick={() => {
                handleFilterChange({
                  type: "reset",
                });
              }}
            >
              Clear All
            </Button>
            <Button
              onClick={() => {
                handleFilterChange({
                  type: "profileFill",
                });
              }}
              variant="solid-primary"
            >
              Fill From Profile
            </Button>
          </Flex>
          {filterGroups.map((val) => {
            return (
              <FeedFilterGroup
                key={val.title}
                filterGroup={val}
                selectedFilters={validatedFilters.postFilters}
                handleFilterChange={handleFilterChange}
              />
            );
          })}
        </Flex>
        <Flex
          width={{ base: "100dvw", lg: "55dvw" }}
          minHeight="0" // To prevent mobile view column flexbox blowout (flex: 1 doesn't respect parent's max height)
          flex="1"
          borderRadius={{ base: "0px", lg: "10px" }}
          backgroundColor={{ base: "white", lg: "#F9F8F8" }}
          direction="column"
          alignItems="center"
          p={{ base: 4, lg: "20px" }}
        >
          <Flex
            w="100%"
            h="min-content"
            dir="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Flex alignItems="center">
              <Text fontWeight="bold" fontSize="20px" pr={3}>
                {filterDisplayed ? "Filter By:" : "Latest Posts"}
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
                <FeedCoveredDropdown
                  displayCovered={validatedFilters.covered}
                  handleCoveredChange={handleCoveredChange}
                />
              </Flex>
            </Flex>
            {(role === Role.Admin || role === Role.ContentCreator) &&
              !(isSmallerThanLg && filterDisplayed) && (
                <Flex
                  bgColor={{ base: "white", lg: "transparent" }}
                  p={{ base: 4, lg: 0 }}
                  position={{ base: "absolute", lg: "static" }}
                  left={{ base: 0 }}
                  bottom={{ base: 0 }}
                  zIndex={1}
                  w={{ base: "100%", lg: "auto" }}
                >
                  <Button
                    variant="solid-primary"
                    leftIcon={<AddIcon />}
                    onClick={onPostCreationOpen}
                    w="100%"
                  >
                    Add new post
                  </Button>
                </Flex>
              )}
            <Button
              display={{ base: "flex", lg: "none" }}
              variant={filterDisplayed ? "outline-secondary" : "solid-primary"}
              onClick={() => {
                setFilterDisplayed(!filterDisplayed);
              }}
              height="36px"
              borderRadius="10px"
            >
              {filterDisplayed ? "Close" : "Filter By"}
            </Button>
          </Flex>
          {!filterDisplayed && (
            <Flex
              display={{
                base:
                  role === Role.Admin || role === Role.ContentCreator
                    ? "flex"
                    : "none",
                md: "none",
              }}
              pt={2}
              w="100%"
            >
              <FeedCoveredDropdown
                displayCovered={validatedFilters.covered}
                handleCoveredChange={handleCoveredChange}
              />
            </Flex>
          )}
          {!isUpdating && !isLoading ? (
            <MediaContextualizedFeedAndFilter />
          ) : (
            <Center height="75%" width="100%">
              <Spinner size="xl" />
            </Center>
          )}
        </Flex>
      </Stack>
      <PostCreationModal
        isOpen={isPostCreationOpen}
        onClose={onPostCreationClose}
      />
    </Flex>
  );
}

export default Feed;
export { getPrefFilters };
