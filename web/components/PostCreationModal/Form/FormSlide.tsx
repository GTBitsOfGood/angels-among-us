import React from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  Box,
  Textarea,
} from "@chakra-ui/react";
import {
  Age,
  ageLabels,
  Breed,
  breedLabels,
  FosterType,
  fosterTypeLabels,
  Gender,
  genderLabels,
  PetKind,
  petKindLabels,
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
      <FormControl>
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
      <FormControl className="descriptionForm">
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
      <Stack direction={"row"} spacing={10}>
        <FormControl className="petKindForm" maxW="450px">
          <FormLabel>What kind of pet?</FormLabel>
          <Select
            styles={{ menu: (base) => ({ ...base, zIndex: 9999 }) }}
            value={
              formState.petKind
                ? {
                    value: formState.petKind as string,
                    label: petKindLabels[formState.petKind],
                  }
                : undefined
            }
            options={Object.entries(petKindLabels).map(([k, v]) => ({
              value: k,
              label: v,
            }))}
            onChange={(e) =>
              dispatchFormState({
                type: "setField",
                key: "petKind",
                data: e!.value as PetKind,
              })
            }
            required
          />
        </FormControl>
        <FormControl className="genderForm" maxW="450px">
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
      </Stack>
      <Stack direction={"row"} spacing={10}>
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
      </Stack>
      <Stack direction={"row"} spacing={10}>
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
      </Stack>
      <FormControl className="breedForm">
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
      <Stack dir="col" spacing={10} pt={2}>
        <Stack direction="row" spacing={10}>
          <Box flex={1}>
            <Text>House Trained</Text>
            <Picker
              field="houseTrained"
              val={formState.houseTrained}
              dispatchFormState={dispatchFormState}
            />
          </Box>
          <Box flex={1}>
            <Text>Crate Trained</Text>
            <Picker
              field="crateTrained"
              val={formState.crateTrained}
              dispatchFormState={dispatchFormState}
            />
          </Box>
          <Box flex={1}>
            <Text>Spay/Neuter Status</Text>
            <Picker
              field="spayNeuterStatus"
              val={formState.spayNeuterStatus}
              dispatchFormState={dispatchFormState}
            />
          </Box>
        </Stack>
        <Stack direction="row" spacing={10}>
          <Box flex={1}>
            <Text>Gets along with men</Text>
            <Picker
              field="getsAlongWithMen"
              val={formState.getsAlongWithMen}
              dispatchFormState={dispatchFormState}
            />
          </Box>
          <Box flex={1}>
            <Text>Gets along with women</Text>
            <Picker
              field="getsAlongWithWomen"
              val={formState.getsAlongWithWomen}
              dispatchFormState={dispatchFormState}
            />
          </Box>
          <Box flex={1}>
            <Text>Gets along with older kids</Text>
            <Picker
              field="getsAlongWithOlderKids"
              val={formState.getsAlongWithOlderKids}
              dispatchFormState={dispatchFormState}
            />
          </Box>
        </Stack>
        <Stack direction="row" spacing={10}>
          <Box flex={1}>
            <Text>Gets along with young kids</Text>
            <Picker
              field="getsAlongWithYoungKids"
              val={formState.getsAlongWithYoungKids}
              dispatchFormState={dispatchFormState}
            />
          </Box>
          <Box flex={1}>
            <Text>Gets along with large dogs</Text>
            <Picker
              field="getsAlongWithLargeDogs"
              val={formState.getsAlongWithLargeDogs}
              dispatchFormState={dispatchFormState}
            />
          </Box>
          <Box flex={1}>
            <Text>Gets along with small dogs</Text>
            <Picker
              field="getsAlongWithSmallDogs"
              val={formState.getsAlongWithSmallDogs}
              dispatchFormState={dispatchFormState}
            />
          </Box>
        </Stack>
        <Box w="12.7rem">
          <Text>Gets along with cats</Text>
          <Picker
            field="getsAlongWithCats"
            val={formState.getsAlongWithCats}
            dispatchFormState={dispatchFormState}
          />
        </Box>
      </Stack>
    </Stack>
  );
};
