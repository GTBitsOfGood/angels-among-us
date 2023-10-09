import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Stack,
  Text,
  useDisclosure,
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
  IPost,
  Size,
  Status,
  Temperament,
  Trained,
} from "../../utils/types/post";
import { IUser } from "../../utils/types/user";
import PetPostModal from "../PetPostModal/PetPostModal";
import PostCreationModal from "../PostCreationModal/PostCreationModal";
import FeedFilterGroup from "./FeedFilterGroup";
import FeedPostCard from "./FeedPostCard";
import { ObjectId } from "mongoose";

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
  houseTrained: Trained;
  spayNeuterStatus: Trained;
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
      {
        key: "temperament",
        description: "Temperaments",
        options: [
          { value: Temperament.Friendly, label: "Friendly" },
          { value: Temperament.Scared, label: "Scared" },
          { value: Temperament.Active, label: "Active" },
          { value: Temperament.Calm, label: "Calm" },
        ],
        dropdown: false,
        allSelected: true,
      },
    ],
  },
  {
    title: "Medical Information",
    filters: [
      {
        key: "medicalInfo",
        description: "Dogs that are:",
        options: [
          { value: Trained.Yes, label: "House Trained" },
          { value: Trained.Yes, label: "Spayed/Neutered" },
        ],
        dropdown: false,
        allSelected: false,
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
 * Parse filter options array containing Status types based on user preferences
 * @param {Option[]} opts array of all possible options
 * @param {(Status | undefined)[]} statArr array of status enums
 * @param {boolean} inverse whether to invert the user preferences
 * @returns {Option[]} status enums converted into Option type
 */
const parseStatusArr = (
  opts: Option[],
  statArr: (Status | undefined)[],
  inverse: boolean = false
): Option[] =>
  inverse
    ? opts.filter((opt, idx) => !(statArr[idx] === Status.Yes))
    : opts.filter((opt, idx) => statArr[idx] === Status.Yes);

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
    temperament: (opts: Option[]) => parseOptArr(opts, userData.temperament),

    // medicalInfo has no 1:1 map with DB fields and also has non-unique filter values (Status.Yes/No)
    medicalInfo: (opts: Option[]) =>
      parseStatusArr(
        opts,
        [userData.houseTrained, userData.spayNeuterStatus],
        true
      ),
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
    if (curr === "medicalInfo") {
      const keys: Record<string, string> = {
        "House Trained": "houseTrained",
        "Spayed/Neutered": "spayNeuterStatus",
      };
      const filterVals: Record<string, PossibleTypes | undefined> =
        selectedFilters[curr].reduce((a, c) => {
          return { ...a, [keys[c.label]]: c.value };
        }, {});
      for (const k of Object.keys(keys)) {
        if (!(keys[k] in filterVals)) {
          filterVals[keys[k]] = undefined;
        }
      }
      return { ...acc, ...filterVals };
    } else {
      const filterVals = selectedFilters[curr].map((v) => v.value);
      return { ...acc, [curr]: filterVals };
    }
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

  const feedPosts: (IPost & { _id: ObjectId })[] | undefined =
    trpc.post.getFilteredPosts.useQuery(getQueryFilters(selectedFilters)).data;

  const [modalPostIndex, setModalPostIndex] = useState(0);

  const mainContent = (
    <Flex
      className="feed"
      backgroundColor="bg-primary"
      justifyContent="center"
      height="100vh"
    >
      <Stack
        spacing={{ base: "0px", lg: "30px" }}
        marginTop={{
          base: document.getElementById("navbar")?.offsetHeight + "px",
          lg: "100px",
        }}
        marginBottom="50px"
        marginX={{ base: "0px", lg: "40px" }}
        direction={{ base: "column", lg: "row" }}
        flex={{ base: "1", lg: "0" }}
      >
        <Flex
          display={{ base: "flex", lg: "none" }}
          backgroundColor="#FFFFFF"
          padding="10px"
          direction="row"
          justifyContent="flex-end"
        >
          <Button
            variant="solid-primary"
            onClick={() => {
              setFilterDisplayed(!filterDisplayed);
            }}
            fontWeight="normal"
            height="36px"
            borderRadius="10px"
          >
            Filter By
          </Button>
        </Flex>
        <Flex
          width="25vw"
          borderRadius="10px"
          backgroundColor="#FFFFFF"
          direction="column"
          display={{ base: "none", lg: "flex" }}
          overflowY="auto"
        >
          <Text fontWeight="semibold" margin="16px">
            Filter By:
          </Text>
          <Flex justifyContent="flex-end" margin="12px" gap="8px">
            <Button
              variant="outline-secondary"
              fontWeight="normal"
              borderWidth="thin"
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
              fontWeight="normal"
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
          backgroundColor={{ base: "bg-primary", lg: "#F9F8F8" }}
          direction="column"
          alignItems="center"
          padding="20px"
        >
          <Flex
            w="100%"
            h="min-content"
            mb="20px"
            dir="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Text fontWeight="bold" fontSize="18px" ml="8px">
              Latest Posts
            </Text>
            {userData?.role !== Role.Volunteer && (
              <Button
                variant="solid-primary"
                leftIcon={<AddIcon />}
                onClick={onPostCreationOpen}
              >
                Add new post
              </Button>
            )}
          </Flex>
          <Stack spacing={5} overflowY="auto">
            {feedPosts?.map((p, ind) => {
              return (
                <Box
                  onClick={() => {
                    setModalPostIndex(ind);
                    onPostViewOpen();
                  }}
                  _hover={{ cursor: "pointer" }}
                  key={ind}
                >
                  <FeedPostCard post={p} />
                </Box>
              );
            })}
          </Stack>
        </Flex>
      </Stack>
    </Flex>
  );

  const filter = (
    <Flex
      className="filter"
      backgroundColor="#DFDFDF"
      height="fit-content"
      minHeight="100vh"
      width="inherit"
      direction="column"
    >
      <Flex
        backgroundColor="#FFFFFF"
        padding="10px"
        direction="row"
        justifyContent="flex-end"
        marginTop={document.getElementById("navbar")?.offsetHeight + "px"}
        borderBottomWidth="2px"
        borderBottomColor="#000000"
      >
        <Button
          variant="outline-secondary"
          onClick={() => {
            setFilterDisplayed(!filterDisplayed);
          }}
          borderWidth="thin"
          fontWeight="normal"
        >
          Close
        </Button>
      </Flex>
      <Flex
        backgroundColor="#FFFFFF"
        direction="column"
        height="fit-content"
        width="inherit"
      >
        <Text
          fontWeight="semibold"
          margin="16px"
          marginBottom="0px"
          marginLeft="30px"
          fontSize="20px"
        >
          Filter By:
        </Text>
        <Flex justifyContent="flex-end" margin="12px" gap="8px">
          <Button
            variant="outline-secondary"
            fontWeight="normal"
            borderWidth="thin"
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
            fontWeight="normal"
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
    </Flex>
  );

  return (
    <>
      {filterDisplayed ? filter : mainContent}
      <PostCreationModal
        isOpen={isPostCreationOpen}
        onClose={onPostCreationClose}
      />
      {feedPosts && feedPosts.length > 0 && (
        <PetPostModal
          isOpen={isPostViewOpen}
          onClose={onPostViewClose}
          postData={feedPosts[modalPostIndex]}
        />
      )}
    </>
  );
}

export default Feed;
export { getPrefFilters };
