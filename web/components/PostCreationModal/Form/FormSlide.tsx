import React from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  Box,
  Textarea,
  Grid,
} from "@chakra-ui/react";
import {
  Age,
  ageLabels,
  Behavioral,
  behavioralLabels,
  Breed,
  breedLabels,
  FosterType,
  fosterTypeLabels,
  Gender,
  genderLabels,
  Medical,
  medicalLabels,
  Size,
  sizeLabels,
  Temperament,
  temperamentLabels,
} from "../../../utils/types/post";
import Select from "react-select";
import { Action, FormState } from "../PostCreationModal";
import Picker from "./Picker";

export const FormSlide: React.FC<{
  dispatchFormState: React.Dispatch<
    Action<keyof FormState, FormState[keyof FormState]>
  >;
  formState: FormState;
}> = ({ formState, dispatchFormState }) => {
  return (
    <Stack dir="col" spacing={5}>
      <Grid gridTemplateColumns="1fr 1fr" rowGap="15px" columnGap="30px">
        <FormControl gridColumn="span 2">
          <FormLabel>Name of the Pet</FormLabel>
          <Input
            value={formState.name}
            onChange={(e) =>
              dispatchFormState({
                type: "setField",
                key: "name",
                data: e.target.value,
              })
            }
          />
        </FormControl>
        <FormControl className="descriptionForm" gridColumn="span 2">
          <FormLabel>Description</FormLabel>
          <Textarea
            value={formState.description}
            onChange={(e) =>
              dispatchFormState({
                type: "setField",
                key: "description",
                data: e.target.value,
              })
            }
          />
        </FormControl>
        <FormControl className="genderForm" width="100%">
          <FormLabel>Gender</FormLabel>
          <Select
            styles={{ menu: (base) => ({ ...base, zIndex: 9999 }) }}
            value={
              formState.gender
                ? {
                    value: formState.gender as string,
                    label: genderLabels[formState.gender],
                  }
                : undefined
            }
            options={Object.entries(genderLabels).map(([k, v]) => ({
              value: k,
              label: v,
            }))}
            onChange={(e) =>
              dispatchFormState({
                type: "setField",
                key: "gender",
                data: e!.value as Gender,
              })
            }
          />
        </FormControl>
        <FormControl className="ageForm" maxW="450px">
          <FormLabel>Age</FormLabel>
          <Select
            styles={{ menu: (base) => ({ ...base, zIndex: 9999 }) }}
            value={
              formState.age
                ? {
                    value: formState.age as string,
                    label: ageLabels[formState.age],
                  }
                : undefined
            }
            options={Object.entries(ageLabels).map(([k, v]) => ({
              value: k,
              label: v,
            }))}
            onChange={(e) =>
              dispatchFormState({
                type: "setField",
                key: "age",
                data: e!.value as Age,
              })
            }
          />
        </FormControl>
        <FormControl className="fosterTypeForm" maxW="450px">
          <FormLabel>Type of foster</FormLabel>
          <Select
            styles={{ menu: (base) => ({ ...base, zIndex: 9999 }) }}
            value={
              formState.type
                ? {
                    value: formState.type as string,
                    label: fosterTypeLabels[formState.type],
                  }
                : undefined
            }
            options={Object.entries(fosterTypeLabels).map(([k, v]) => ({
              value: k,
              label: v,
            }))}
            onChange={(e) =>
              dispatchFormState({
                type: "setField",
                key: "type",
                data: e!.value as FosterType,
              })
            }
          />
        </FormControl>
        <FormControl className="sizeForm" maxW="450px">
          <FormLabel>Size</FormLabel>
          <Select
            styles={{ menu: (base) => ({ ...base, zIndex: 9999 }) }}
            value={
              formState.size
                ? {
                    value: formState.size as string,
                    label: sizeLabels[formState.size],
                  }
                : undefined
            }
            options={Object.entries(sizeLabels).map(([k, v]) => ({
              value: k,
              label: v,
            }))}
            onChange={(e) =>
              dispatchFormState({
                type: "setField",
                key: "size",
                data: e!.value as Size,
              })
            }
          />
        </FormControl>
        <FormControl className="temperamentForm" maxW="450px">
          <FormLabel>Temperament</FormLabel>
          <Select
            isMulti
            closeMenuOnSelect={false}
            value={formState.temperament.map((val) => ({
              value: val as string,
              label: temperamentLabels[val],
            }))}
            styles={{ menu: (base) => ({ ...base, zIndex: 9999 }) }}
            options={Object.entries(temperamentLabels).map(([k, v]) => ({
              value: k,
              label: v,
            }))}
            onChange={(e) =>
              dispatchFormState({
                type: "setField",
                key: "temperament",
                data: e!.map(({ value }) => value) as Temperament[],
              })
            }
          />
        </FormControl>
        <FormControl className="breedForm" gridColumn="span 2">
          <FormLabel>Breed</FormLabel>
          <Select
            isMulti
            closeMenuOnSelect={false}
            value={formState.breed.map((val) => ({
              value: val as string,
              label: breedLabels[val],
            }))}
            styles={{ menu: (base) => ({ ...base, zIndex: 9999 }) }}
            options={Object.entries(breedLabels).map(([k, v]) => ({
              value: k,
              label: v,
            }))}
            onChange={(e) =>
              dispatchFormState({
                type: "setField",
                key: "breed",
                data: e!.map(({ value }) => value) as Breed[],
              })
            }
          />
        </FormControl>
        <FormControl className="medicalForm" maxW="450px">
          <FormLabel>Medical</FormLabel>
          <Select
            isMulti
            closeMenuOnSelect={false}
            value={formState.medical.map((val) => ({
              value: val as string,
              label: medicalLabels[val],
            }))}
            styles={{ menu: (base) => ({ ...base, zIndex: 9999 }) }}
            options={Object.entries(medicalLabels).map(([k, v]) => ({
              value: k,
              label: v,
            }))}
            onChange={(e) =>
              dispatchFormState({
                type: "setField",
                key: "medical",
                data: e!.map(({ value }) => value) as Medical[],
              })
            }
          />
        </FormControl>
        <FormControl className="behavioralForm" maxW="450px">
          <FormLabel>Behavioral</FormLabel>
          <Select
            isMulti
            closeMenuOnSelect={false}
            value={formState.behavioral.map((val) => ({
              value: val as string,
              label: behavioralLabels[val],
            }))}
            styles={{ menu: (base) => ({ ...base, zIndex: 9999 }) }}
            options={Object.entries(behavioralLabels).map(([k, v]) => ({
              value: k,
              label: v,
            }))}
            onChange={(e) =>
              dispatchFormState({
                type: "setField",
                key: "behavioral",
                data: e!.map(({ value }) => value) as Behavioral[],
              })
            }
          />
        </FormControl>
      </Grid>
      <Box>
        <Grid
          templateColumns={{ base: "repeat(3, 1fr)", md: "repeat(3, 1fr)" }}
          columnGap="30px"
          rowGap="30px"
        >
          <Box>
            <Text>House Trained</Text>
            <Picker
              field="houseTrained"
              val={formState.houseTrained}
              dispatchFormState={dispatchFormState}
            />
          </Box>
          <Box>
            <Text>Crate Trained</Text>
            <Picker
              field="crateTrained"
              val={formState.crateTrained}
              dispatchFormState={dispatchFormState}
            />
          </Box>
          <Box>
            <Text>Spay/Neuter Status</Text>
            <Picker
              field="spayNeuterStatus"
              val={formState.spayNeuterStatus}
              dispatchFormState={dispatchFormState}
            />
          </Box>
          <Box>
            <Text>Gets along with men</Text>
            <Picker
              field="getsAlongWithMen"
              val={formState.getsAlongWithMen}
              dispatchFormState={dispatchFormState}
            />
          </Box>
          <Box>
            <Text>Gets along with women</Text>
            <Picker
              field="getsAlongWithWomen"
              val={formState.getsAlongWithWomen}
              dispatchFormState={dispatchFormState}
            />
          </Box>
          <Box>
            <Text>Gets along with older kids</Text>
            <Picker
              field="getsAlongWithOlderKids"
              val={formState.getsAlongWithOlderKids}
              dispatchFormState={dispatchFormState}
            />
          </Box>
          <Box>
            <Text>Gets along with young kids</Text>
            <Picker
              field="getsAlongWithYoungKids"
              val={formState.getsAlongWithYoungKids}
              dispatchFormState={dispatchFormState}
            />
          </Box>
          <Box>
            <Text>Gets along with large dogs</Text>
            <Picker
              field="getsAlongWithLargeDogs"
              val={formState.getsAlongWithLargeDogs}
              dispatchFormState={dispatchFormState}
            />
          </Box>
          <Box>
            <Text>Gets along with small dogs</Text>
            <Picker
              field="getsAlongWithSmallDogs"
              val={formState.getsAlongWithSmallDogs}
              dispatchFormState={dispatchFormState}
            />
          </Box>
        </Grid>
      </Box>
    </Stack>
  );
};
