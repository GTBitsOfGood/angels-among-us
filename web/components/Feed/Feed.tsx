import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Flex,
  Spinner,
  Stack,
  Text,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import { Dispatch, SetStateAction, useReducer, useState } from "react";
import { useAuth } from "../../context/auth";
import { PossibleTypes } from "../../pages/onboarding";
import { trpc } from "../../utils/trpc";
import { Role } from "../../utils/types/account";
import {
  Age,
  Behavioral,
  Breed,
  FosterType,
  Gender,
  GoodWith,
  IFeedPost,
  Size,
} from "../../utils/types/post";
import { IUser } from "../../utils/types/user";
import PetPostModal from "../PetPostModal/PetPostModal";
import PostCreationModal from "../PostCreationModal/PostCreationModal";
import FeedFilterGroup from "./FeedFilterGroup";
import FeedPostCard from "./FeedPostCard";
import { Types } from "mongoose";
import useDebounce from "../../hooks/useDebounce";
import FeedCoveredDropdown from "./FeedCoveredDropdown";

export type FilterGroup = {
  title: string;
  filters: Filter[];
};

export type Filter = {
  key: string;
  description: string;
  options: Option[];
  dropdown: boolean;
  allSelected: boolean;
};

export type Option = {
  value: PossibleTypes;
  label: string;
};

export type SelectedFilters = {
  [key: Filter["key"]]: Option[];
};

export type OptHandlers = {
  [key: Filter["key"]]: (opts: Option[]) => Option[];
};

//TODO: Temperament is not included currently.
export type QueryFilter = {
  breed: Breed[];
  type: FosterType[];
  age: Age[];
  size: Size[];
  gender: Gender[];
  behavioral: Behavioral[];
  goodWith: GoodWith[];
};

const filterGroups: FilterGroup[] = [
  {
    title: "General Information",
    filters: [
      {
        key: "type",
        description: "Which types of fosters can you help with?",
        options: [
          { value: FosterType.Return, label: "Return" },
          { value: FosterType.Boarding, label: "Boarding" },
          { value: FosterType.Temporary, label: "Temporary" },
          { value: FosterType.FosterMove, label: "Foster Move" },
          { value: FosterType.Shelter, label: "Shelter" },
          { value: FosterType.OwnerSurrender, label: "Owner Surrender" },
        ],
        dropdown: false,
        allSelected: true,
      },
    ],
  },
  {
    title: "Physical Traits",
    filters: [
      {
        key: "breed",
        description: "Breeds",
        options: [
          { value: Breed.AmericanEskimo, label: "American Eskimo" },
          { value: Breed.AustralianShepherd, label: "Australian Shepherd" },
          { value: Breed.Beagle, label: "Beagle" },
          { value: Breed.BichonFrise, label: "Bichon Frise" },
          { value: Breed.BorderCollie, label: "Border Collie" },
          { value: Breed.Boxer, label: "Boxer" },
          { value: Breed.BrusselsGriffon, label: "Brussels Griffon" },
          { value: Breed.Bulldog, label: "Bulldog" },
          { value: Breed.CaneCorsoMastiff, label: "Cane Corso/Mastiff" },
          { value: Breed.CattleDogHeeler, label: "Cattle Dog/Heeler" },
          { value: Breed.Chihuahua, label: "Chihuahua" },
          { value: Breed.ChowChow, label: "Chow Chow" },
          { value: Breed.Collie, label: "Collie" },
          { value: Breed.Corgi, label: "Corgi" },
          { value: Breed.Dachshund, label: "Dachshund" },
          { value: Breed.Dalmatian, label: "Dalmatian" },
          { value: Breed.DobermanPinscher, label: "Doberman Pinscher" },
          { value: Breed.GermanShepherd, label: "German Shepherd" },
          { value: Breed.GoldenRetriever, label: "Golden Retriever" },
          { value: Breed.GreatDane, label: "Great Dane" },
          { value: Breed.GreatPyrenees, label: "Great Pyrenees" },
          { value: Breed.Greyhound, label: "Greyhound" },
          { value: Breed.Hound, label: "Hound" },
          { value: Breed.Husky, label: "Husky" },
          { value: Breed.LabradorRetriever, label: "Labrador Retriever" },
          { value: Breed.Malamute, label: "Malamute" },
          { value: Breed.Maltese, label: "Maltese" },
          { value: Breed.MinPin, label: "Min Pin" },
          { value: Breed.Mix, label: "Mix" },
          { value: Breed.Newfoundland, label: "Newfoundland" },
          { value: Breed.Pekingese, label: "Pekingese" },
          { value: Breed.Pitbull, label: "Pitbull" },
          { value: Breed.Pointer, label: "Pointer" },
          { value: Breed.Pomeranian, label: "Pomeranian" },
          { value: Breed.Poodle, label: "Poodle" },
          { value: Breed.Pug, label: "Pug" },
          { value: Breed.Rottweiler, label: "Rottweiler" },
          { value: Breed.Schnauzer, label: "Schnauzer" },
          { value: Breed.Scottie, label: "Scottie" },
          { value: Breed.Setter, label: "Setter" },
          { value: Breed.Sharpei, label: "Sharpei" },
          { value: Breed.Sheepdog, label: "Sheepdog" },
          { value: Breed.Shepherd, label: "Shepherd" },
          { value: Breed.ShihTzu, label: "Shih Tzu" },
          { value: Breed.Spaniel, label: "Spaniel" },
          { value: Breed.StBernard, label: "St. Bernard" },
          { value: Breed.TerrierMedLarge, label: "Terrier (Med-Large)" },
          { value: Breed.TerrierSmall, label: "Terrier (Small)" },
          { value: Breed.Weimaraner, label: "Weimaraner" },
          { value: Breed.Whippet, label: "Whippet" },
        ],
        dropdown: true,
        allSelected: true,
      },
      {
        key: "age",
        description: "Age",
        options: [
          { value: Age.Puppy, label: "Puppy" },
          { value: Age.Young, label: "Young" },
          { value: Age.Adult, label: "Adult" },
          { value: Age.Senior, label: "Senior" },
          { value: Age.MomAndPuppies, label: "Mom & Puppies" },
        ],
        dropdown: false,
        allSelected: true,
      },
      {
        key: "size",
        description: "Size",
        options: [
          { value: Size.XS, label: "Extra Small" },
          { value: Size.S, label: "Small" },
          { value: Size.M, label: "Medium" },
          { value: Size.L, label: "Large" },
          { value: Size.XL, label: "Extra Large" },
        ],
        dropdown: false,
        allSelected: true,
      },
      {
        key: "gender",
        description: "Gender",
        options: [
          { value: Gender.Male, label: "Male" },
          { value: Gender.Female, label: "Female" },
          { value: Gender.Litter, label: "Litter" },
        ],
        dropdown: false,
        allSelected: true,
      },
    ],
  },
  {
    title: "Behavioral Traits",
    filters: [
      {
        key: "goodWith",
        description: "Dogs known to be good with:",
        options: [
          { value: GoodWith.Men, label: "Men" },
          { value: GoodWith.Women, label: "Women" },
          { value: GoodWith.OlderChildren, label: "Older Children" },
          { value: GoodWith.YoungChildren, label: "Young Children" },
          { value: GoodWith.LargeDogs, label: "Large Dogs" },
          { value: GoodWith.SmallDogs, label: "Small Dogs" },
          { value: GoodWith.Cats, label: "Cats" },
        ],
        dropdown: false,
        allSelected: false,
      },
      {
        key: "behavioral",
        description: "Able to foster dogs with:",
        options: [
          { value: Behavioral.SeparationAnxiety, label: "Separation Anxiety" },
          { value: Behavioral.Barking, label: "Barking" },
          { value: Behavioral.Jumping, label: "Jumping" },
          { value: Behavioral.BiteRisk, label: "Bite Risk" },
          { value: Behavioral.PullsOnLeash, label: "Pulls on Leash" },
          { value: Behavioral.FlightRisk, label: "Flight Risk" },
        ],
        dropdown: false,
        allSelected: true,
      },
    ],
  },
] satisfies FilterGroup[];

/**
 * Parse filter options array based on user preferences
 * @param {Option[]} opts array of all possible options
 * @param {PossibleTypes | undefined} prefArr array of filter option enums
 * @param {boolean} inverse whether to invert the user preferences
 * @returns {Option[]} option enums converted into Option type
 */
const parseOptArr = (
  opts: Option[],
  prefArr: PossibleTypes[] | undefined,
  inverse: boolean = false
): Option[] =>
  inverse
    ? [...opts.filter((f) => !prefArr?.includes(f.value))]
    : [...opts.filter((f) => prefArr?.includes(f.value))];

/**
 * Imports user preferences and maps them to the feed filters
 * @param {IUser | null} userData user data
 * @returns {SelectedFilters | null} preferred filters
 */
function getPrefFilters(userData: IUser | null): SelectedFilters | null {
  if (!userData) {
    return null;
  }

  const optHandlers: OptHandlers = {
    type: (opts: Option[]) => parseOptArr(opts, userData.type),
    breed: (opts: Option[]) =>
      parseOptArr(opts, userData.restrictedBreeds, true),
    age: (opts: Option[]) => parseOptArr(opts, userData.age),
    size: (opts: Option[]) => parseOptArr(opts, userData.size),
    gender: (opts: Option[]) => parseOptArr(opts, userData.gender),
    goodWith: (opts: Option[]) =>
      parseOptArr(opts, userData.dogsNotGoodWith, true),
    behavioral: (opts: Option[]) => parseOptArr(opts, userData.behavioral),
  };

  const filters = filterGroups.reduce((acc, curr) => {
    const group = curr.filters.reduce((a, c) => {
      return {
        ...a,
        [c.key]: optHandlers[c.key](c.options),
      };
    }, {});
    return {
      ...acc,
      ...group,
    };
  }, {});
  return filters;
}

/**
 * Transforms `selectedFilters` into QueryFilter to match API input
 * @param selectedFilters selected feed filters
 * @returns query filters used to send shaped to the API input
 */
function getQueryFilters(selectedFilters: SelectedFilters) {
  const queryFilters = Object.keys(selectedFilters).reduce((acc, curr) => {
    const filterVals = selectedFilters[curr].map((v) => v.value);
    return { ...acc, [curr]: filterVals };
  }, {});
  return queryFilters as QueryFilter;
}

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
  const {
    isOpen: isPostViewOpen,
    onOpen: onPostViewOpen,
    onClose: onPostViewClose,
  } = useDisclosure();

  const { userData } = useAuth();

  const role = userData?.role;

  const [displayCovered, setDisplayCovered] = useState<boolean | undefined>(
    undefined
  );
  const [isSmallerThanLg] = useMediaQuery("(max-width: 62em)");

  function getInitialFilters(): SelectedFilters {
    return filterGroups.reduce((acc, curr) => {
      const group = curr.filters.reduce((a, c) => {
        if (c.allSelected) return { ...a, [c.key]: [...c.options] };
        return { ...a, [c.key]: [] };
      }, {});
      return {
        ...acc,
        ...group,
      };
    }, {});
  }

  function filterReducer(
    state: SelectedFilters,
    action: {
      type: string;
      filter: Filter;
      ind: number;
      event: Option[];
    }
  ) {
    let tempState = JSON.parse(JSON.stringify(state));
    switch (action.type) {
      case "reset":
        return getInitialFilters();
      case "useprefs":
        return getPrefFilters(userData) || state;
      case "dropdown":
        tempState[action.filter.key] = action.event;
        return tempState;
      case "checkbox":
        const filt = action.filter;
        const ind = action.ind;
        const option = filt.options[ind];
        if (
          tempState[filt.key].some(
            (e: Option) => e.value == option.value && e.label == option.label
          )
        ) {
          tempState[filt.key].splice(
            tempState[filt.key].findIndex(
              (e: Option) => e.value == option.value && e.label == option.label
            ),
            1
          );
        } else {
          tempState[filt.key].push(filt.options[ind]);
        }
        return tempState;
      default:
        return state;
    }
  }

  const [selectedFilters, setSelectedFilters] = useReducer(
    filterReducer,
    getInitialFilters()
  );

  const feedPosts: IFeedPost[] | undefined =
    trpc.post.getFilteredPosts.useQuery({
      postFilters: getQueryFilters(selectedFilters),
      covered: role === Role.Volunteer ? false : displayCovered,
    }).data;
  const [debouncedFeedPosts, isUpdating] = useDebounce(feedPosts, 400);

  const [modalPostId, setModalPostId] = useState<Types.ObjectId | null>(null);

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
            setSelectedFilters({
              type: "reset",
              filter: filterGroups[0].filters[0],
              ind: 0,
              event: [],
            });
          }}
        >
          Clear All
        </Button>
        <Button
          w="100%"
          onClick={() => {
            setSelectedFilters({
              type: "useprefs",
              filter: filterGroups[0].filters[0],
              ind: 0,
              event: [],
            });
          }}
          variant="solid-primary"
        >
          Use My Preferences
        </Button>
      </Flex>
      <Flex direction="column">
        {filterGroups.map((val) => {
          return (
            <FeedFilterGroup
              key={val.title}
              filterGroup={val}
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
            />
          );
        })}
      </Flex>
    </Flex>
  );

  return (
    <Flex
      className="feed"
      backgroundColor={{ base: "white", lg: "bg-primary" }}
      justifyContent="center"
      height="100vh"
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
                setSelectedFilters({
                  type: "reset",
                  filter: filterGroups[0].filters[0],
                  ind: 0,
                  event: [],
                });
              }}
            >
              Clear All
            </Button>
            <Button
              onClick={() => {
                setSelectedFilters({
                  type: "useprefs",
                  filter: filterGroups[0].filters[0],
                  ind: 0,
                  event: [],
                });
              }}
              variant="solid-primary"
            >
              Use My Preferences
            </Button>
          </Flex>
          {filterGroups.map((val) => {
            return (
              <FeedFilterGroup
                key={val.title}
                filterGroup={val}
                selectedFilters={selectedFilters}
                setSelectedFilters={setSelectedFilters}
              />
            );
          })}
        </Flex>
        <Flex
          width={{ base: "100vw", lg: "55vw" }}
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
                  displayCovered={displayCovered}
                  setDisplayCovered={setDisplayCovered}
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
                displayCovered={displayCovered}
                setDisplayCovered={setDisplayCovered}
              />
            </Flex>
          )}
          {isUpdating ? (
            <Center height="75%" width="100%">
              <Spinner size="xl" />
            </Center>
          ) : filterDisplayed && isSmallerThanLg ? (
            filter
          ) : (
            <Stack overflowY="auto" spacing={0} w="100%" mt={4}>
              {debouncedFeedPosts?.map((p) => {
                return (
                  <Box
                    onClick={() => {
                      setModalPostId(p._id);
                      onPostViewOpen();
                    }}
                    _hover={{ cursor: "pointer" }}
                    key={p._id.toString()}
                  >
                    <FeedPostCard post={p} />
                  </Box>
                );
              })}
            </Stack>
          )}
        </Flex>
      </Stack>
      <PostCreationModal
        isOpen={isPostCreationOpen}
        onClose={onPostCreationClose}
      />
      {debouncedFeedPosts && debouncedFeedPosts.length > 0 && modalPostId && (
        <PetPostModal
          isOpen={isPostViewOpen}
          onClose={onPostViewClose}
          postId={modalPostId}
          setModalPostId={setModalPostId}
        />
      )}
    </Flex>
  );
}

export default Feed;
export { getPrefFilters };
