import React from "react";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
  Text,
  Slider,
  SliderMark,
  SliderFilledTrack,
  SliderTrack,
  SliderThumb,
  Box,
} from "@chakra-ui/react";
import {
  Age,
  Behavioral,
  Breed,
  FosterType,
  Gender,
  GoodWith,
  Medical,
  PetKind,
  Size,
  Temperament,
  Trained,
} from "../../../utils/types/post";
import Select from "react-select";
import { FormState } from "../PostCreationModal";
import Picker from "./Picker";

const petKindOptions = [
  { value: PetKind.Dog, label: "Dog" },
  { value: PetKind.Cat, label: "Cat" },
];

const genderOptions = [
  { value: Gender.Female, label: "Female" },
  { value: Gender.Male, label: "Male" },
  { value: Gender.Litter, label: "Litter" },
];

const ageOptions = [
  { value: Age.Puppy, label: "Puppy" },
  { value: Age.Young, label: "Young" },
  { value: Age.Adult, label: "Adult" },
  { value: Age.Senior, label: "Senior" },
  { value: Age.MomAndPuppies, label: "Mom & Puppies" },
];

const fosterTypeOptions = [
  { value: FosterType.Return, label: "Return" },
  { value: FosterType.Boarding, label: "Boarding" },
  { value: FosterType.Temporary, label: "Temporary" },
  { value: FosterType.FosterMove, label: "Foster Move" },
  { value: FosterType.Shelter, label: "Shelter" },
  { value: FosterType.OwnerSurrender, label: "Owner Surrender" },
];

const sizeOptions = [
  { value: Size.XS, label: "XS" },
  { value: Size.S, label: "S" },
  { value: Size.M, label: "M" },
  { value: Size.L, label: "L" },
  { value: Size.XL, label: "XL" },
];

const breedOptions = [
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
  { value: Breed.StBernard, label: "StBernard" },
  { value: Breed.TerrierMedLarge, label: "Terrier (Med-Large)" },
  { value: Breed.TerrierSmall, label: "Terrier (Small)" },
  { value: Breed.Weimaraner, label: "Weimaraner" },
  { value: Breed.Whippet, label: "Whippet" },
];

const temperamentOptions = [
  { value: Temperament.Friendly, label: "Friendly" },
  { value: Temperament.Scared, label: "Scared" },
  { value: Temperament.Active, label: "Active" },
  { value: Temperament.Calm, label: "Calm" },
];

const goodWithOptions = [
  { value: GoodWith.Men, label: "Men" },
  { value: GoodWith.Women, label: "Women" },
  { value: GoodWith.OlderChildren, label: "Older Children" },
  { value: GoodWith.YoungChildren, label: "Young Children" },
  { value: GoodWith.LargeDogs, label: "Large Dogs" },
  { value: GoodWith.SmallDogs, label: "Small Dogs" },
  { value: GoodWith.Cats, label: "Cats" },
];

const medicalOptions = [
  { value: Medical.Illness, label: "Illness" },
  { value: Medical.Injury, label: "Injury" },
  { value: Medical.Heartworms, label: "Heartworms" },
  { value: Medical.Parvo, label: "Parvo" },
  { value: Medical.ChronicCondition, label: "Chronic Condition" },
  { value: Medical.Pregnant, label: "Pregnant" },
  { value: Medical.Nursing, label: "Nursing" },
  { value: Medical.BottleFed, label: "Bottle Feeding" },
];

const behavioralOptions = [
  { value: Behavioral.SeparationAnxiety, label: "Separation Anxiety" },
  { value: Behavioral.Barking, label: "Barking" },
  { value: Behavioral.Jumping, label: "Jumping" },
  { value: Behavioral.FlightRisk, label: "Flight Risk" },
  { value: Behavioral.BiteRisk, label: "Bite Risk" },
  { value: Behavioral.PullsOnLeash, label: "Pulls On Leash" },
];

const trainedOptions = [
  { value: Trained.Yes, label: "Yes" },
  { value: Trained.No, label: "No" },
  { value: Trained.Unknown, label: "Unknown" },
];

export const FormSlide: React.FC<{
  setIsFormValid: React.Dispatch<React.SetStateAction<boolean>>;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
  formState: FormState;
}> = ({ formState, setFormState, setIsFormValid }) => {
  return (
    <>
      {/* if it doesnt get fixed then just bring formik into return :  onSubmit={formik.handleSubmit}*/}
      <Stack dir="col" spacing={5}>
        <FormControl>
          <FormLabel>Name of the Pet</FormLabel>
          <Input
            // name="name"
            type="name"
            onChange={(e) => {
              setFormState({ ...formState, name: e.target.value });
            }}
          />
        </FormControl>
        <FormControl className="descriptionForm">
          <FormLabel>Description</FormLabel>
          <Input
            type="description"
            placeholder="Type here..."
            onChange={(e) => {
              setFormState({ ...formState, description: e.target.value });
            }}
          />
        </FormControl>
        <Stack direction={"row"} spacing={10}>
          <FormControl className="petKindForm" maxW="450px">
            <FormLabel>What kind of pet?</FormLabel>
            <Select
              styles={{ menu: (base) => ({ ...base, zIndex: 9999 }) }}
              options={petKindOptions}
              onChange={(e) => {
                setFormState({ ...formState, petKind: e!.value });
              }}
              required
            />
          </FormControl>
          <FormControl className="genderForm" maxW="450px">
            <FormLabel>Gender</FormLabel>
            <Select
              styles={{ menu: (base) => ({ ...base, zIndex: 9999 }) }}
              options={genderOptions}
              onChange={(e) => {
                setFormState({ ...formState, gender: e!.value });
              }}
            />
          </FormControl>
        </Stack>
        <Stack direction={"row"} spacing={10}>
          <FormControl className="ageForm" maxW="450px">
            <FormLabel>Age</FormLabel>
            <Select
              styles={{ menu: (base) => ({ ...base, zIndex: 9999 }) }}
              options={ageOptions}
              onChange={(e) => {
                setFormState({ ...formState, age: e!.value });
              }}
            />
          </FormControl>
          <FormControl className="fosterTypeForm" maxW="450px">
            <FormLabel>Types of Foster</FormLabel>
            <Select
              styles={{ menu: (base) => ({ ...base, zIndex: 9999 }) }}
              options={fosterTypeOptions}
              onChange={(e) => {
                setFormState({ ...formState, fosterType: e!.value });
              }}
            />
          </FormControl>
        </Stack>
        <Stack direction={"row"} spacing={10}>
          <FormControl className="sizeForm" maxW="450px">
            <FormLabel>Size</FormLabel>
            <Select
              styles={{ menu: (base) => ({ ...base, zIndex: 9999 }) }}
              options={sizeOptions}
              onChange={(e) => {
                setFormState({ ...formState, size: e!.value });
              }}
            />
          </FormControl>
          <FormControl className="temperamentForm" maxW="450px">
            <FormLabel>Temperament</FormLabel>
            <Select
              styles={{ menu: (base) => ({ ...base, zIndex: 9999 }) }}
              options={temperamentOptions}
              onChange={(e) => {
                // setFormState({ ...formState, temperament: e!.value });
              }}
            />
          </FormControl>
        </Stack>
        <FormControl className="breedForm">
          <FormLabel>Breed</FormLabel>
          <Select
            styles={{ menu: (base) => ({ ...base, zIndex: 9999 }) }}
            options={breedOptions}
            onChange={(e) => {
              // setFormState({ ...formState, breed: e!.value });
            }}
          />
        </FormControl>
        <Stack dir="col" spacing={10}>
          <Stack direction="row" spacing={10}>
            <Box flex={1}>
              <Text>House Trained</Text>
              <Picker setVal={setFormState} />
            </Box>
            <Box flex={1}>
              <Text>Crate Trained</Text>
              <Picker setVal={setFormState} />
            </Box>
            <Box flex={1}>
              <Text>Spay/Neuter Status</Text>
              <Picker setVal={setFormState} />
            </Box>
          </Stack>
          <Stack direction="row" spacing={10}>
            <Box flex={1}>
              <Text>Gets along with men</Text>
              <Picker setVal={setFormState} />
            </Box>
            <Box flex={1}>
              <Text>Gets along with women</Text>
              <Picker setVal={setFormState} />
            </Box>
            <Box flex={1}>
              <Text>Gets along with older kids</Text>
              <Picker setVal={setFormState} />
            </Box>
          </Stack>
          <Stack direction="row" spacing={10}>
            <Box flex={1}>
              <Text>Gets along with young kids</Text>
              <Picker setVal={setFormState} />
            </Box>
            <Box flex={1}>
              <Text>Gets along with large dogs</Text>
              <Picker setVal={setFormState} />
            </Box>
            <Box flex={1}>
              <Text>Gets along with small dogs</Text>
              <Picker setVal={setFormState} />
            </Box>
          </Stack>
          <Box w="12.7rem">
            <Text>Gets along with cats</Text>
            <Picker setVal={setFormState} />
          </Box>
        </Stack>
      </Stack>
      {/* <Stack direction={"row"} spacing={10}>
        <FormControl className="medicalForm" maxW="450px">
          <FormLabel>Medical (Optional)</FormLabel>
          <Select
            options={medicalOptions}
            isMulti
            onChange={(e) => {
              setFormState({
                ...formState,
                medical: e.map((option) => option.value),
              });
            }}
          />
        </FormControl>
        <FormControl className="behavioralForm" maxW="450px">
          <FormLabel>Behavioral</FormLabel>
          <Select
            options={behavioralOptions}
            isMulti
            onChange={(e) => {
              setFormState({
                ...formState,
                behavioral: e.map((option) => option.value),
              });
            }}
          />
        </FormControl>
      </Stack>

      <Stack direction={"row"} spacing={10}>
        <FormControl className="houseTrainedForm" maxW="300px">
          <FormLabel>House Trained</FormLabel>
          <Select
            options={trainedOptions}
            onChange={(e) => {
              setFormState({ ...formState, houseTrained: e!.value });
            }}
          />
        </FormControl>
        <FormControl className="crateTrainedForm" maxW="300px">
          <FormLabel>Crate Trained</FormLabel>
          <Select
            options={trainedOptions}
            onChange={(e) => {
              setFormState({ ...formState, crateTrained: e!.value });
            }}
          />
        </FormControl>
        <FormControl className="spayneuterForm" maxW="300px">
          <FormLabel>Spay/Neuter status</FormLabel>
          <Select
            options={trainedOptions}
            onChange={(e) => {
              setFormState({ ...formState, spayNeuterStatus: e!.value });
            }}
          />
        </FormControl>
      </Stack> */}
    </>
  );
};
