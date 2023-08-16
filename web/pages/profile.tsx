import React, { useReducer, useState } from "react";
import {
  Button,
  Flex,
  Stack,
  Text,
  Input,
  Image,
  Box,
  Heading,
  StackDivider,
} from "@chakra-ui/react";

import Select from "react-select";
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
  GoodWith,
  goodWithLabels,
  Size,
  sizeLabels,
  Status,
  statusLabels,
  Temperament,
  temperamentLabels,
} from "../utils/types/post";
import { useAuth } from "../context/auth";
import pageAccessHOC from "../components/HOC/PageAccess";
import { IUser } from "../utils/types/user";
import { trpc } from "../utils/trpc";
import Section from "../components/Profile/Section";

function Profile() {
  const { user, userData } = useAuth();
  const [editing, setEditing] = useState(false);

  function pruneUserData(
    data: NonNullable<typeof userData>
  ): Omit<
    NonNullable<IUser>,
    "email" | "name" | "uid" | "role" | "disabled" | "hasCompletedOnboarding"
  > {
    const {
      email,
      name,
      uid,
      role,
      disabled,
      hasCompletedOnboarding,
      ...initialState
    } = data;
    return initialState;
  }

  const initialFormState = userData ? pruneUserData(userData) : {};

  type Action<
    K extends keyof ReturnType<typeof pruneUserData>,
    V extends ReturnType<typeof pruneUserData>[K]
  > = { type: "setField" | "clear"; key?: K; data?: V };

  function reducer<
    K extends keyof ReturnType<typeof pruneUserData>,
    V extends ReturnType<typeof pruneUserData>[K]
  >(state: ReturnType<typeof pruneUserData>, action: Action<K, V>) {
    switch (action.type) {
      case "setField":
        return {
          ...state,
          [action.key!]: action.data!,
        };
      case "clear":
        return initialFormState;
      default:
        throw Error("Unknown action.");
    }
  }

  const [preferences, dispatch] = useReducer(reducer, initialFormState);

  const updatePreferences = trpc.user.updateUserPreferences.useMutation();

  return (
    <Flex
      display={["none", "flex"]}
      bgColor="bg-primary"
      justifyContent="center"
    >
      <Box
        width="80%"
        p={8}
        bgColor="white"
        borderRadius={12}
        mt={100}
        mb={100}
      >
        <Flex w="100%" justifyContent="space-between" alignItems="center">
          <Heading size="lg" letterSpacing="wide">
            Profile
          </Heading>
          {!editing ? (
            <Button variant="solid-primary" onClick={() => setEditing(true)}>
              Edit
            </Button>
          ) : (
            <Stack direction="row">
              <Button
                variant="outline-secondary"
                fontWeight="thin"
                borderWidth="thin"
                onClick={() => {
                  dispatch({ type: "clear" });
                  setEditing(false);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="solid-primary"
                onClick={async () => {
                  const req = await updatePreferences.mutateAsync({
                    uid: userData!.uid,
                    updateFields: preferences,
                  });
                  if (req.success) {
                    setEditing(false);
                  }
                }}
              >
                Save
              </Button>
            </Stack>
          )}
        </Flex>
        <Stack
          mt={5}
          direction="column"
          spacing={5}
          divider={<StackDivider borderColor="gray.200" />}
        >
          <Section heading="General Information">
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
                alt="User photo"
              ></Image>

              <Stack direction="column" width="85%" spacing={5}>
                <Stack direction="row" spacing={5}>
                  <Stack direction="column" width="50%">
                    <Text fontWeight="medium">Name</Text>
                    <Input
                      placeholder={
                        userData?.name ?? user?.displayName ?? undefined
                      }
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
                      closeMenuOnSelect={false}
                      onChange={(newVals) =>
                        dispatch({
                          type: "setField",
                          key: "type",
                          data: (
                            newVals as {
                              value: FosterType;
                              label: string;
                            }[]
                          ).map(({ value }) => value),
                        })
                      }
                      value={preferences?.type?.map((type) => ({
                        value: type as string,
                        label: fosterTypeLabels[type],
                      }))}
                      isDisabled={!editing}
                      isMulti
                      options={Object.entries(fosterTypeLabels).map(
                        ([key, val]) => ({ value: key, label: val })
                      )}
                    />
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          </Section>
          <Section heading="Physical Traits">
            <Stack direction="column" w="100%" spacing={5}>
              <Stack direction="row" spacing={5}>
                <Stack direction="column" width="50%">
                  <Text fontWeight="medium">Breed Restrictions</Text>
                  <Select
                    closeMenuOnSelect={false}
                    onChange={(newVals) =>
                      dispatch({
                        type: "setField",
                        key: "restrictedBreeds",
                        data: (
                          newVals as {
                            value: Breed;
                            label: string;
                          }[]
                        ).map(({ value }) => value),
                      })
                    }
                    value={preferences?.restrictedBreeds?.map((breed) => ({
                      value: breed as string,
                      label: breedLabels[breed],
                    }))}
                    isDisabled={!editing}
                    isMulti
                    options={Object.entries(breedLabels).map(([key, val]) => ({
                      value: key,
                      label: val,
                    }))}
                  />
                </Stack>
                <Stack direction="column" width="50%">
                  <Text fontWeight="medium">Breed Preferences</Text>
                  <Select
                    closeMenuOnSelect={false}
                    onChange={(newVals) =>
                      dispatch({
                        type: "setField",
                        key: "preferredBreeds",
                        data: (
                          newVals as {
                            value: Breed;
                            label: string;
                          }[]
                        ).map(({ value }) => value),
                      })
                    }
                    value={preferences?.preferredBreeds?.map((breed) => ({
                      value: breed as string,
                      label: breedLabels[breed],
                    }))}
                    isDisabled={!editing}
                    isMulti
                    options={Object.entries(breedLabels).map(([key, val]) => ({
                      value: key,
                      label: val,
                    }))}
                  />
                </Stack>
              </Stack>
              <Stack direction="row" spacing={5}>
                <Stack direction="column" width="50%">
                  <Text fontWeight="medium">Age Capability</Text>
                  <Select
                    closeMenuOnSelect={false}
                    onChange={(newVals) =>
                      dispatch({
                        type: "setField",
                        key: "age",
                        data: (
                          newVals as {
                            value: Age;
                            label: string;
                          }[]
                        ).map(({ value }) => value),
                      })
                    }
                    value={preferences?.age?.map((age) => ({
                      value: age as string,
                      label: ageLabels[age],
                    }))}
                    isDisabled={!editing}
                    isMulti
                    options={Object.entries(ageLabels).map(([key, val]) => ({
                      value: key,
                      label: val,
                    }))}
                  />
                </Stack>
                <Stack direction="column" width="50%">
                  <Text fontWeight="medium">Dog Size Capability</Text>
                  <Select
                    closeMenuOnSelect={false}
                    onChange={(newVals) =>
                      dispatch({
                        type: "setField",
                        key: "size",
                        data: (
                          newVals as {
                            value: Size;
                            label: string;
                          }[]
                        ).map(({ value }) => value),
                      })
                    }
                    value={preferences?.size?.map((size) => ({
                      value: size as string,
                      label: sizeLabels[size],
                    }))}
                    isDisabled={!editing}
                    isMulti
                    options={Object.entries(sizeLabels).map(([key, val]) => ({
                      value: key,
                      label: val,
                    }))}
                  />
                </Stack>
              </Stack>
              <Stack direction="row" spacing={5}>
                <Stack direction="column" width="50%">
                  <Text fontWeight="medium">Gender Capability</Text>
                  <Select
                    closeMenuOnSelect={false}
                    onChange={(newVals) =>
                      dispatch({
                        type: "setField",
                        key: "gender",
                        data: (
                          newVals as {
                            value: Gender;
                            label: string;
                          }[]
                        ).map(({ value }) => value),
                      })
                    }
                    value={preferences?.gender?.map((gender) => ({
                      value: gender as string,
                      label: genderLabels[gender],
                    }))}
                    isDisabled={!editing}
                    isMulti
                    options={Object.entries(genderLabels).map(([key, val]) => ({
                      value: key,
                      label: val,
                    }))}
                  />
                </Stack>
                <Stack direction="column" width="50%"></Stack>
              </Stack>
            </Stack>
          </Section>
          <Section heading="Behavioral Traits">
            <Stack direction="column" w="100%" spacing={5}>
              <Stack direction="row" spacing={5}>
                <Stack direction="column" width="50%">
                  <Text fontWeight="medium">
                    Able to foster dogs NOT good with:
                  </Text>
                  <Select
                    closeMenuOnSelect={false}
                    onChange={(newVals) =>
                      dispatch({
                        type: "setField",
                        key: "dogsNotGoodWith",
                        data: (
                          newVals as {
                            value: GoodWith;
                            label: string;
                          }[]
                        ).map(({ value }) => value),
                      })
                    }
                    value={preferences?.dogsNotGoodWith?.map((goodWith) => ({
                      value: goodWith as string,
                      label: goodWithLabels[goodWith],
                    }))}
                    isDisabled={!editing}
                    isMulti
                    options={Object.entries(goodWithLabels).map(
                      ([key, val]) => ({ value: key, label: val })
                    )}
                  />
                </Stack>
                <Stack direction="column" width="50%">
                  <Text fontWeight="medium">Able to foster dogs with:</Text>
                  <Select
                    closeMenuOnSelect={false}
                    onChange={(newVals) =>
                      dispatch({
                        type: "setField",
                        key: "behavioral",
                        data: (
                          newVals as {
                            value: Behavioral;
                            label: string;
                          }[]
                        ).map(({ value }) => value),
                      })
                    }
                    value={preferences?.behavioral?.map((behavior) => ({
                      value: behavior as string,
                      label: behavioralLabels[behavior],
                    }))}
                    isDisabled={!editing}
                    isMulti
                    options={Object.entries(behavioralLabels).map(
                      ([key, val]) => ({ value: key, label: val })
                    )}
                  />
                </Stack>
              </Stack>
              <Stack direction="row">
                <Stack direction="column" width="50%">
                  <Text fontWeight="medium">
                    Able to foster dogs with these temperaments:
                  </Text>
                  <Select
                    closeMenuOnSelect={false}
                    onChange={(newVals) =>
                      dispatch({
                        type: "setField",
                        key: "temperament",
                        data: (
                          newVals as {
                            value: Temperament;
                            label: string;
                          }[]
                        ).map(({ value }) => value),
                      })
                    }
                    value={preferences?.temperament?.map((temperament) => ({
                      value: temperament as string,
                      label: temperamentLabels[temperament],
                    }))}
                    isDisabled={!editing}
                    isMulti
                    options={Object.entries(temperamentLabels).map(
                      ([key, val]) => ({ value: key, label: val })
                    )}
                  />
                </Stack>
              </Stack>
            </Stack>
          </Section>
          <Section heading="Medical Information">
            <Stack direction="column" width="100%" spacing={5}>
              <Stack direction="row" spacing={5}>
                <Stack direction="column" width="50%">
                  <Text fontWeight="medium">
                    Able to foster dogs not house trained...
                  </Text>
                  <Select
                    onChange={(newVal) =>
                      dispatch({
                        type: "setField",
                        key: "houseTrained",
                        data: newVal!.value,
                      })
                    }
                    value={
                      preferences.houseTrained
                        ? {
                            value: preferences.houseTrained,
                            label: statusLabels[preferences.houseTrained],
                          }
                        : undefined
                    }
                    isDisabled={!editing}
                    options={Object.entries(statusLabels).map(([key, val]) => ({
                      value: key as Status,
                      label: val,
                    }))}
                  />
                </Stack>
                <Stack direction="column" width="50%">
                  <Text fontWeight="medium">
                    Able to foster dogs not spayed or neutered...
                  </Text>
                  <Select
                    onChange={(newVal) =>
                      dispatch({
                        type: "setField",
                        key: "spayNeuterStatus",
                        data: newVal!.value,
                      })
                    }
                    value={
                      preferences.spayNeuterStatus
                        ? {
                            value: preferences.spayNeuterStatus,
                            label: statusLabels[preferences.spayNeuterStatus],
                          }
                        : undefined
                    }
                    isDisabled={!editing}
                    options={Object.entries(statusLabels).map(([key, val]) => ({
                      value: key as Status,
                      label: val,
                    }))}
                  />
                </Stack>
              </Stack>
            </Stack>
          </Section>
        </Stack>
      </Box>
    </Flex>
  );
}

export default pageAccessHOC(Profile);
