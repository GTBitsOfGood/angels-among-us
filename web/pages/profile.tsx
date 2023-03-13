import {
  Button,
  Flex,
  Stack,
  Text,
  IconButton,
  Input,
  Image,
  Box,
} from "@chakra-ui/react";

import { EditIcon } from "@chakra-ui/icons";

import React from "react";
import Select from "react-select";
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
} from "../utils/types/post";
import { useAuth } from "../context/auth";

export default function Profile() {
  const { user, loading, userData, authorized } = useAuth();
  const [editing, setEditing] = React.useState(false);
  const { user } = useAuth();

  const fosterTypes = [
    { value: FosterType.Return, label: "Return" },
    { value: FosterType.Boarding, label: "Boarding" },
    { value: FosterType.Temporary, label: "Temporary" },
    { value: FosterType.FosterMove, label: "Foster Move" },
    { value: FosterType.OwnerSurrender, label: "Owner Surrender" },
    { value: FosterType.Shelter, label: "Shelter" },
  ];
  const breeds = [
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
  ];
  const ages = [
    { value: Age.Puppy, label: "Puppy" },
    { value: Age.Young, label: "Young Adult" },
    { value: Age.Adult, label: "Adult" },
    { value: Age.Senior, label: "Senior" },
    { value: Age.MomAndPuppies, label: "Mom & Puppies" },
  ];
  const sizes = [
    { value: Size.XS, label: "XS" },
    { value: Size.S, label: "S" },
    { value: Size.M, label: "M" },
    { value: Size.L, label: "L" },
    { value: Size.XL, label: "XL" },
  ];
  const genders = [
    { value: Gender.Male, label: "Male" },
    { value: Gender.Female, label: "Female" },
    { value: Gender.Litter, label: "Litter" },
  ];
  const compatibilities = [
    { value: GoodWith.Men, label: "Men" },
    { value: GoodWith, label: "Women" },
    { value: GoodWith.OlderChildren, label: "Older Children" },
    { value: GoodWith.YoungChildren, label: "Young Children" },
    { value: GoodWith.LargeDogs, label: "Large Dogs" },
    { value: GoodWith.SmallDogs, label: "Small Dogs" },
    { value: GoodWith.Cats, label: "Cats" },
  ];
  const behaviors = [
    { value: Behavioral.SeparationAnxiety, label: "Separation Anxiety" },
    { value: Behavioral.Barking, label: "Barking" },
    { value: Behavioral.Jumping, label: "Jumping" },
    { value: Behavioral.FlightRisk, label: "Flight Risk" },
    { value: Behavioral.BiteRisk, label: "Bite Risk" },
    { value: Behavioral.PullsOnLeash, label: "Pulls on Leash" },
  ];
  const temperaments = [
    { value: Temperament.Friendly, label: "Friendly" },
    { value: Temperament.Scared, label: "Scared" },
    { value: Temperament.Active, label: "Active" },
    { value: Temperament.Calm, label: "Calm" },
  ];
  const statuses = [
    { value: Status.Yes, label: "Yes" },
    { value: Status.No, label: "No" },
  ];
  return (
    <>
      <Flex
        display={["none", "flex"]}
        minHeight="180vh"
        bgColor="#C9C9C9"
        justifyContent="center"
      >
        <Flex
          width="93%"
          marginTop="7%"
          justifyContent="center"
          alignItems="center"
          bgColor="white"
        >
          <Stack
            direction="column"
            position="absolute"
            top="170px"
            width="80%"
            spacing={5}
          >
            <Stack
              width="100%"
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Text fontSize="2xl" fontWeight="semibold">
                Profile
              </Text>
              {!editing ? (
                <Button
                  bgColor="#BCBCBC"
                  width="6%"
                  borderRadius="16px"
                  onClick={() => setEditing(true)}
                >
                  Edit
                </Button>
              ) : (
                <Stack direction="row">
                  <Button
                    bgColor="#DAD8D8"
                    borderRadius="16px"
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </Button>

                  <Button
                    bgColor="#BCBCBC"
                    borderRadius="16px"
                    onClick={() => setEditing(false)}
                  >
                    Save
                  </Button>
                </Stack>
              )}
            </Stack>
            <Stack direction="column">
              <Stack direction="row">
                <Text fontWeight="semibold">General Information</Text>
                {editing && (
                  <Text fontSize="larger" color="red" fontWeight="bold">
                    *
                  </Text>
                )}
              </Stack>

              <Flex border="1px solid black" padding={10}>
                <Stack
                  width="100%"
                  direction="row"
                  spacing={10}
                  alignItems="center"
                >
                  <Image
                    borderRadius="100%"
                    boxSize={36}
                    src={user?.photoURL ?? undefined}
                  ></Image>
                  <Stack direction="column" width="85%" spacing={5}>
                    <Stack direction="row" spacing={5}>
                      <Stack direction="column" width="50%">
                        <Text fontWeight="medium">Name</Text>
                        <Input
                          placeholder={user?.displayName ?? undefined}
                          disabled={true}
                        ></Input>
                      </Stack>
                      <Stack direction="column" width="50%">
                        <Text fontWeight="medium">Preferred Email</Text>
                        <Input placeholder={""} disabled={!editing}></Input>
                      </Stack>
                    </Stack>
                    <Stack direction="row" spacing={5}>
                      <Stack direction="column" width="50%">
                        <Text fontWeight="medium">Email</Text>
                        <Input
                          placeholder={user?.email ?? undefined}
                          disabled={true}
                        ></Input>
                      </Stack>
                      <Stack direction="column" width="50%">
                        <Text fontWeight="medium">
                          Which types of fosters can you help with?
                        </Text>
                        <Select
                          isDisabled={!editing}
                          isMulti
                          options={fosterTypes}
                        />
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack>
              </Flex>
            </Stack>
            <Stack direction="column">
              <Text fontWeight="semibold">Physical Traits</Text>
              <Flex
                border="1px solid black"
                justifyContent="center"
                padding={5}
              >
                <Stack direction="column" width="90%" spacing={5}>
                  <Stack direction="row" spacing={5}>
                    <Stack direction="column" width="50%">
                      <Text fontWeight="medium">Breed Restrictions</Text>
                      <Select isDisabled={!editing} isMulti options={breeds} />
                    </Stack>
                    <Stack direction="column" width="50%">
                      <Text fontWeight="medium">Age Preferences</Text>
                      <Select isDisabled={!editing} isMulti options={ages} />
                    </Stack>
                  </Stack>
                  <Stack direction="row" spacing={5}>
                    <Stack direction="column" width="50%">
                      <Text fontWeight="medium">Dog Size Preference</Text>
                      <Select isDisabled={!editing} isMulti options={sizes} />
                    </Stack>
                    <Stack direction="column" width="50%">
                      <Text fontWeight="medium">Gender Preference</Text>
                      <Select isDisabled={!editing} isMulti options={genders} />
                    </Stack>
                  </Stack>
                </Stack>
              </Flex>
            </Stack>
            <Stack direction="column">
              <Text fontWeight="semibold">Behavioral Traits</Text>
              <Flex
                border="1px solid black"
                justifyContent="center"
                padding={5}
              >
                <Stack direction="column" width="90%" spacing={5}>
                  <Stack direction="row" spacing={5}>
                    <Stack direction="column" width="50%">
                      <Text fontWeight="medium">
                        Able to foster dogs NOT good with:
                      </Text>
                      <Select
                        isDisabled={!editing}
                        isMulti
                        options={compatibilities}
                      />
                    </Stack>
                    <Stack direction="column" width="50%">
                      <Text fontWeight="medium">Able to foster dogs with:</Text>
                      <Select
                        isDisabled={!editing}
                        isMulti
                        options={behaviors}
                      />
                    </Stack>
                  </Stack>
                  <Stack direction="row">
                    <Stack direction="column" width="50%">
                      <Text fontWeight="medium">
                        Able to foster dogs with these temperaments:
                      </Text>
                      <Select
                        isDisabled={!editing}
                        isMulti
                        options={temperaments}
                      />
                    </Stack>
                  </Stack>
                </Stack>
              </Flex>
            </Stack>
            <Stack direction="column">
              <Text fontWeight="semibold">Medical Information</Text>
              <Flex
                border="1px solid black"
                justifyContent="center"
                padding={5}
              >
                <Stack direction="column" width="90%" spacing={5}>
                  <Stack direction="row" spacing={5}>
                    <Stack direction="column" width="50%">
                      <Text fontWeight="medium">
                        Able to foster dogs not house trained...
                      </Text>
                      <Select
                        isDisabled={!editing}
                        isMulti
                        options={statuses}
                      />
                    </Stack>
                    <Stack direction="column" width="50%">
                      <Text fontWeight="medium">
                        Able to foster dogs not crate trained...
                      </Text>
                      <Select
                        isDisabled={!editing}
                        isMulti
                        options={statuses}
                      />
                    </Stack>
                  </Stack>
                  <Stack direction="row">
                    <Stack direction="column" width="50%">
                      <Text fontWeight="medium">
                        Able to foster dogs not spayed or neutered...
                      </Text>
                      <Select
                        isDisabled={!editing}
                        isMulti
                        options={statuses}
                      />
                    </Stack>
                  </Stack>
                </Stack>
              </Flex>
            </Stack>
          </Stack>
        </Flex>
      </Flex>
      <Flex height="100vh" display={["flex", "none"]} justifyContent="center">
        <Stack
          direction="column"
          position="absolute"
          top="100px"
          alignItems="center"
          spacing={5}
        >
          <Stack direction="row" justifyContent="space-between" width="100%">
            <Stack direction="column">
              <Text fontWeight="bold" fontSize="2xl">
                Profile
              </Text>
              <Stack direction="row">
                <Text fontWeight="bold" fontSize="lg">
                  General Information
                </Text>
                {editing && (
                  <Text fontWeight="bold" fontSize="lg" color="red">
                    *
                  </Text>
                )}
              </Stack>
            </Stack>
            {editing ? (
              <Stack direction="row">
                <Button
                  cursor="default"
                  bgColor="#DAD8D8"
                  borderRadius="16px"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </Button>

                <Button
                  cursor="default"
                  bgColor="#C9C9C9"
                  borderRadius="16px"
                  onClick={() => setEditing(false)}
                >
                  Save
                </Button>
              </Stack>
            ) : (
              <Button
                cursor="default"
                bgColor="#C9C9C9"
                borderRadius="16px"
                onClick={() => setEditing(true)}
              >
                Edit
              </Button>
            )}
          </Stack>
          <Box bgColor="#C9C9C9" borderRadius="100%" boxSize={20}></Box>
          {editing && (
            <IconButton
              icon={<EditIcon />}
              aria-label={""}
              bgColor="white"
              borderRadius="100%"
              position="absolute"
              top="120px"
              left="170px"
            />
          )}
          <Stack direction="column" spacing={7}>
            <Stack direction="column" spacing={4}>
              <Stack direction="column">
                <Text fontWeight="medium">Name</Text>
                <Input
                  placeholder={user?.displayName ?? undefined}
                  disabled={true}
                  border="1px solid gray"
                ></Input>
              </Stack>
              <Stack direction="column">
                <Text fontWeight="medium">Email</Text>
                <Input
                  border="1px solid gray"
                  placeholder={user?.email ?? undefined}
                  disabled={true}
                ></Input>
              </Stack>
              <Stack direction="column">
                <Text fontWeight="medium">Preferred Email</Text>
                <Input
                  border="1px solid gray"
                  placeholder={""}
                  disabled={!editing}
                ></Input>
              </Stack>
              <Stack direction="column">
                <Text fontWeight="medium">
                  Which types of fosters can you NOT help with?
                </Text>
                <Select isDisabled={!editing} isMulti options={fosterTypes} />
              </Stack>
            </Stack>
            <Text fontSize="lg" fontWeight="bold">
              Physical Traits
            </Text>
            <Stack direction="column" spacing={4}>
              <Stack direction="column" width="100%">
                <Text fontWeight="medium">Breed Restrictions</Text>
                <Select isDisabled={!editing} isMulti options={breeds} />
              </Stack>
              <Stack direction="column" width="100%">
                <Text fontWeight="medium">Dog Sizes you do NOT Prefer</Text>
                <Select isDisabled={!editing} isMulti options={sizes} />
              </Stack>
              <Stack direction="column" width="100%">
                <Text fontWeight="medium">Ages NOT Preferred</Text>
                <Select isDisabled={!editing} isMulti options={ages} />
              </Stack>
              <Stack direction="column" width="100%">
                <Text fontWeight="medium">Genders you do NOT Prefer</Text>
                <Select isDisabled={!editing} isMulti options={genders} />
              </Stack>
            </Stack>
            <Text fontSize="lg" fontWeight="bold">
              Behavioral Traits
            </Text>
            <Stack direction="column" spacing={4}>
              <Stack direction="column" width="100%">
                <Text fontWeight="medium">
                  Able to foster dogs NOT good with:
                </Text>
                <Select
                  isDisabled={!editing}
                  isMulti
                  options={compatibilities}
                />
              </Stack>
              <Stack direction="column" width="100%">
                <Text fontWeight="medium">
                  Able to foster dogs with these temperaments:
                </Text>
                <Select isDisabled={!editing} isMulti options={temperaments} />
              </Stack>
              <Stack direction="column" width="100%">
                <Text fontWeight="medium">Able to foster dogs with:</Text>
                <Select isDisabled={!editing} isMulti options={behaviors} />
              </Stack>
            </Stack>
            <Text fontSize="lg" fontWeight="bold">
              Medical Information
            </Text>
            <Stack direction="column" spacing={4}>
              <Stack direction="column" width="100%">
                <Text fontWeight="medium">
                  Able to foster dogs not house trained...
                </Text>
                <Select isDisabled={!editing} isMulti options={statuses} />
              </Stack>
              <Stack direction="column" width="100%">
                <Text fontWeight="medium">
                  Able to foster dogs not spayed or neutered...
                </Text>
                <Select isDisabled={!editing} isMulti options={statuses} />
              </Stack>
              <Stack direction="column" width="100%">
                <Text fontWeight="medium">
                  Able to foster dogs not crate trained...
                </Text>
                <Select isDisabled={!editing} isMulti options={statuses} />
              </Stack>
            </Stack>
            <Stack direction="row" justifyContent="flex-end" paddingBottom={10}>
              {editing ? (
                <>
                  <Button
                    cursor="default"
                    bgColor="#DAD8D8"
                    borderRadius="16px"
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </Button>

                  <Button
                    cursor="default"
                    bgColor="#C9C9C9"
                    borderRadius="16px"
                    onClick={() => setEditing(false)}
                  >
                    Save
                  </Button>
                </>
              ) : (
                <Button
                  bgColor="#C9C9C9"
                  cursor="default"
                  borderRadius="16px"
                  onClick={() => setEditing(true)}
                >
                  Edit
                </Button>
              )}
            </Stack>
          </Stack>
        </Stack>
      </Flex>
    </>
  );
}
