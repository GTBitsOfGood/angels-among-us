import { Button, Flex, Stack, Text } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useState } from "react";
import { PossibleTypes } from "../pages/onboarding";
import {
  Age,
  Behavioral,
  Breed,
  FosterType,
  Gender,
  GoodWith,
  Size,
  Status,
  Temperament,
  Trained,
} from "../utils/types/post";
import FeedFilterGroup from "./FeedFilterGroup";
import FeedPostCard from "./FeedPostCard";

export type FilterGroup = {
  title: string;
  filters: Filter[];
};

export type Filter = {
  key: string;
  description: string;
  options: { value: PossibleTypes; label: string }[];
  dropdown: boolean;
  allSelected: boolean;
};

export type SelectedFilters<T extends Filter> = {
  [key in T["key"]]: { value: PossibleTypes; label: string }[];
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
        description: "Breed Restrictions",
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
          { value: Trained.Yes, label: "Crate Trained" },
          { value: Status.Yes, label: "Spayed/Neutered" },
        ],
        dropdown: false,
        allSelected: false,
      },
    ],
  },
];

function Feed(props: {
  filterDisplayed: boolean;
  setFilterDisplayed: Dispatch<SetStateAction<boolean>>;
}) {
  let { filterDisplayed, setFilterDisplayed } = props;

  function getInitialFilters() {
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

  const [selectedFilters, setSelectedFilters] = useState(getInitialFilters());

  const mainContent = (
    <Flex
      className="feed"
      backgroundColor="#C3E6F9"
      justifyContent="center"
      height="fit-content"
      minHeight="100vh"
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
      >
        <Flex
          display={{ base: "flex", lg: "none" }}
          backgroundColor="#FFFFFF"
          padding="10px"
          direction="row"
          justifyContent="flex-end"
        >
          <Button
            onClick={() => {
              setFilterDisplayed(!filterDisplayed);
              console.log(filterDisplayed);
            }}
            backgroundColor="#529FD4"
            color="#FFFFFF"
            fontWeight="normal"
            height="36px"
            borderRadius="10px"
          >
            Filter By
          </Button>
        </Flex>
        <Flex
          width="30%"
          borderRadius="10px"
          backgroundColor="#FFFFFF"
          direction="column"
          height="fit-content"
          display={{ base: "none", lg: "flex" }}
        >
          <Text fontWeight="semibold" margin="16px">
            Filter By:
          </Text>
          <Flex justifyContent="flex-end" margin="12px" gap="8px">
            <Button
              backgroundColor="#FFFFFF"
              fontWeight="normal"
              color="#7D7E82"
              borderWidth="1px"
              borderColor="#7D7E82"
              borderRadius="12px"
              onClick={() => {
                setSelectedFilters(getInitialFilters());
              }}
            >
              Clear All
            </Button>
            <Button
              backgroundColor="#529FD4"
              fontWeight="normal"
              color="#FFFFFF"
              borderRadius="12px"
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
          width={{ base: "100%", lg: "70%" }}
          minHeight="full"
          borderRadius={{ base: "0px", lg: "10px" }}
          backgroundColor={{ base: "#C6E3F9", lg: "#F9F8F8" }}
          direction="column"
          alignItems="center"
          height="fit-content"
          paddingY="20px"
        >
          <Text fontWeight="bold" fontSize="18px">
            Latest Posts
          </Text>
          <FeedPostCard
            image={
              "https://images.unsplash.com/photo-1615751072497-5f5169febe17?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y3V0ZSUyMGRvZ3xlbnwwfHwwfHw%3D&w=1000&q=80"
            }
            date={"MM/DD/YYYY XX:XX PM"}
            title={"Pet Name"}
            tags={["Foster Move"]}
            body={
              "Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit amet consectetur."
            }
          />
          <FeedPostCard
            image={
              "https://images.unsplash.com/photo-1615751072497-5f5169febe17?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y3V0ZSUyMGRvZ3xlbnwwfHwwfHw%3D&w=1000&q=80"
            }
            date={"MM/DD/YYYY XX:XX PM"}
            title={"Pet Name"}
            tags={["Foster Move"]}
            body={
              "Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit amet consectetur."
            }
          />
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
          onClick={() => {
            setFilterDisplayed(!filterDisplayed);
          }}
          backgroundColor="#FFFFFF"
          color="#7D7E82"
          borderWidth="1px"
          borderColor="#7D7E82"
          fontWeight="normal"
          height="36px"
          borderRadius="10px"
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
            backgroundColor="#FFFFFF"
            fontWeight="normal"
            color="#7D7E82"
            borderWidth="1px"
            borderColor="#7D7E82"
            borderRadius="12px"
            onClick={() => {
              setSelectedFilters(getInitialFilters());
            }}
          >
            Clear All
          </Button>
          <Button
            backgroundColor="#529FD4"
            fontWeight="normal"
            color="#FFFFFF"
            borderRadius="12px"
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

  return filterDisplayed ? filter : mainContent;
}

export default Feed;
