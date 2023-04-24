import React, { useReducer, useState } from "react";
import { Button, Flex, Stack, Text, Input, Image } from "@chakra-ui/react";

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
  trainedLabels,
} from "../utils/types/post";
import { useAuth } from "../context/auth";
import pageAccessHOC from "../components/HOC/PageAccess";
import { IUser } from "../utils/types/user";
import { trpc } from "../utils/trpc";

function Profile() {
  const { user, userData } = useAuth();
  const [editing, setEditing] = useState(false);

  function pruneUserData(
    data: NonNullable<typeof userData>
  ): Omit<NonNullable<IUser>, "email" | "name" | "uid" | "role" | "disabled"> {
    const { __v, _id, email, name, uid, role, disabled, ...initialState } =
      data;
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
      minHeight="180vh"
      bgColor="#D7E4EE"
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
                bgColor="angelsBlue.100"
                color="white"
                width="6%"
                borderRadius="16px"
                onClick={() => setEditing(true)}
              >
                Edit
              </Button>
            ) : (
              <Stack direction="row">
                <Button
                  border="1px solid gray"
                  bgColor="white"
                  color="gray"
                  borderRadius="16px"
                  onClick={() => {
                    dispatch({ type: "clear" });
                    setEditing(false);
                  }}
                >
                  Cancel
                </Button>

                <Button
                  bgColor="angelsBlue.100"
                  color="white"
                  borderRadius="16px"
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

            <Flex border="1px solid black" padding={10} borderRadius="12px">
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
            </Flex>
          </Stack>
          <Stack direction="column">
            <Text fontWeight="semibold">Physical Traits</Text>
            <Flex
              borderRadius="12px"
              border="1px solid black"
              justifyContent="center"
              padding={5}
            >
              <Stack direction="column" width="90%" spacing={5}>
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
                      options={Object.entries(breedLabels).map(
                        ([key, val]) => ({ value: key, label: val })
                      )}
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
                      options={Object.entries(breedLabels).map(
                        ([key, val]) => ({ value: key, label: val })
                      )}
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
                      options={Object.entries(genderLabels).map(
                        ([key, val]) => ({ value: key, label: val })
                      )}
                    />
                  </Stack>
                  <Stack direction="column" width="50%"></Stack>
                </Stack>
              </Stack>
            </Flex>
          </Stack>
          <Stack direction="column">
            <Text fontWeight="semibold">Behavioral Traits</Text>
            <Flex
              border="1px solid black"
              borderRadius="12px"
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
            </Flex>
          </Stack>
          <Stack direction="column">
            <Text fontWeight="semibold">Medical Information</Text>
            <Flex
              borderRadius="12px"
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
                      closeMenuOnSelect={false}
                      onChange={(newVals) =>
                        dispatch({
                          type: "setField",
                          key: "houseTrained",
                          data: (
                            newVals as {
                              value: Status;
                              label: string;
                            }[]
                          ).map(({ value }) => value),
                        })
                      }
                      value={preferences?.houseTrained?.map((trained) => ({
                        value: trained as string,
                        label: trainedLabels[trained],
                      }))}
                      isDisabled={!editing}
                      isMulti
                      options={Object.entries(statusLabels).map(
                        ([key, val]) => ({ value: key, label: val })
                      )}
                    />
                  </Stack>
                  <Stack direction="column" width="50%">
                    <Text fontWeight="medium">
                      Able to foster dogs not spayed or neutered...
                    </Text>
                    <Select
                      closeMenuOnSelect={false}
                      onChange={(newVals) =>
                        dispatch({
                          type: "setField",
                          key: "spayNeuterStatus",
                          data: (
                            newVals as {
                              value: Status;
                              label: string;
                            }[]
                          ).map(({ value }) => value),
                        })
                      }
                      value={preferences?.spayNeuterStatus?.map((status) => ({
                        value: status as string,
                        label: statusLabels[status],
                      }))}
                      isDisabled={!editing}
                      isMulti
                      options={Object.entries(statusLabels).map(
                        ([key, val]) => ({ value: key, label: val })
                      )}
                    />
                  </Stack>
                </Stack>
              </Stack>
            </Flex>
          </Stack>
        </Stack>
      </Flex>
    </Flex>
  );
}

export default pageAccessHOC(Profile);
