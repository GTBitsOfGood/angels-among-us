import {
  Button,
  Flex,
  Stack,
  Text,
  Image,
  Accordion,
  AccordionItem,
  AccordionButton,
  Box,
  AccordionPanel,
  AccordionIcon,
  Card,
  Checkbox,
} from "@chakra-ui/react";
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
  singleAnswer: boolean;
};

export type SelectedFilters<T extends Filter> = {
  [key in T["key"]]: PossibleTypes[];
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
        singleAnswer: false,
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
        singleAnswer: false,
      },
      {
        key: "age",
        description: "Age Capability",
        options: [
          { value: Age.Puppy, label: "Puppy" },
          { value: Age.Young, label: "Young" },
          { value: Age.Adult, label: "Adult" },
          { value: Age.Senior, label: "Senior" },
          { value: Age.MomAndPuppies, label: "Mom & Puppies" },
        ],
        dropdown: false,
        singleAnswer: false,
      },
      {
        key: "size",
        description: "Dog Size Capability",
        options: [
          { value: Size.XS, label: "Extra Small" },
          { value: Size.S, label: "Small" },
          { value: Size.M, label: "Medium" },
          { value: Size.L, label: "Large" },
          { value: Size.XL, label: "Extra Large" },
        ],
        dropdown: false,
        singleAnswer: false,
      },
      {
        key: "gender",
        description: "Gender Capability",
        options: [
          { value: Gender.Male, label: "Male" },
          { value: Gender.Female, label: "Female" },
          { value: Gender.Litter, label: "Litter" },
        ],
        dropdown: false,
        singleAnswer: false,
      },
    ],
  },
  {
    title: "Behavioral Traits",
    filters: [
      {
        key: "goodWith",
        description: "Able to foster dogs NOT good with:",
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
        singleAnswer: false,
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
        singleAnswer: false,
      },
      {
        key: "temperament",
        description: "Able to foster dogs with these temperaments:",
        options: [
          { value: Temperament.Friendly, label: "Friendly" },
          { value: Temperament.Scared, label: "Scared" },
          { value: Temperament.Active, label: "Active" },
          { value: Temperament.Calm, label: "Calm" },
        ],
        dropdown: false,
        singleAnswer: false,
      },
    ],
  },
  {
    title: "Medical Information",
    filters: [
      {
        key: "houseTrained",
        description: "Able to foster dogs not house trained...",
        options: [
          { value: Trained.Yes, label: "Yes" },
          { value: Trained.No, label: "No" },
        ],
        dropdown: false,
        singleAnswer: true,
      },
      {
        key: "crateTrained",
        description: "Able to foster dogs not crate trained...",
        options: [
          { value: Trained.Yes, label: "Yes" },
          { value: Trained.No, label: "No" },
        ],
        dropdown: false,
        singleAnswer: true,
      },
      {
        key: "spayNeuterStatus",
        description: "Able to foster dogs not spayed or neutered...",
        options: [
          { value: Status.Yes, label: "Yes" },
          { value: Status.No, label: "No" },
        ],
        dropdown: false,
        singleAnswer: true,
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
        if (c.singleAnswer) return { ...a, [c.key]: [c.options[0].value] };
        if (c.dropdown) return { ...a, [c.key]: [] };
        return { ...a, [c.key]: c.options.map((val) => val.value) };
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
      backgroundColor="#DFDFDF"
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
            backgroundColor="#8F9294"
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
              backgroundColor="#8F9294"
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
          backgroundColor="#C1C1C1"
          direction="column"
          alignItems="center"
          height="fit-content"
          paddingY="20px"
        >
          <Text fontWeight="bold" fontSize="18px">
            Latest Posts
          </Text>
          <FeedPostCard
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
            console.log(filterDisplayed);
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
          >
            Clear All
          </Button>
          <Button
            backgroundColor="#8F9294"
            fontWeight="normal"
            color="#FFFFFF"
            borderRadius="12px"
          >
            Use My Preferences
          </Button>
        </Flex>
        <Accordion allowMultiple={true}>
          <AccordionItem>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                <Text fontWeight="semibold">General Information</Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} marginRight="40px">
              <Text>Which types of fosters can you help with?</Text>
              <Flex
                direction="column"
                borderWidth="2px"
                borderColor="#D9D9D9"
                borderRadius="6px"
                gap="10px"
                padding="16px"
                marginTop="16px"
              >
                <Checkbox>Return</Checkbox>
                <Checkbox>Boarding</Checkbox>
                <Checkbox>Temporary</Checkbox>
                <Checkbox>Foster Move</Checkbox>
                <Checkbox>Shelter</Checkbox>
                <Checkbox>Owner Surrender</Checkbox>
              </Flex>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Flex>
    </Flex>
  );

  return filterDisplayed ? filter : mainContent;
}

export default Feed;
