import React, { useEffect, useReducer, useRef, useState } from "react";
import {
  Button,
  Flex,
  Stack,
  Text,
  Input,
  Image,
  Box,
  StackDivider,
  useToast,
  AlertDialog,
  useDisclosure,
  AlertDialogBody,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
} from "@chakra-ui/react";

import Select, { components } from "react-select";
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
  Medical,
  medicalLabels,
  Size,
  sizeLabels,
} from "../utils/types/post";
import { useAuth } from "../context/auth";
import pageAccessHOC from "../components/HOC/PageAccess";
import { IUser } from "../utils/types/user";
import { trpc } from "../utils/trpc";
import Section from "../components/Profile/Section";
import { z } from "zod";
import { useRouter } from "next/router";
import { Url } from "url";

type OptionalKeys<T extends object> = Exclude<
  {
    [K in keyof T]: T extends Record<K, T[K]> ? never : K;
  }[keyof T],
  undefined
>;

const emailValidation = z.string().transform((val, ctx) => {
  if (val.length === 0) {
    return val;
  }
  if (!z.string().email().safeParse(val).success) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Invalid email address.",
    });
    return z.NEVER;
  }
  return val;
});

const profileSchema = z.object({
  name: z.string().min(1, { message: "Name must not be empty." }),
  preferredEmail: emailValidation,
  type: z.array(z.nativeEnum(FosterType)),
  size: z.array(z.nativeEnum(Size)),
  restrictedBreeds: z.array(z.nativeEnum(Breed)),
  preferredBreeds: z.array(z.nativeEnum(Breed)),
  gender: z.array(z.nativeEnum(Gender)),
  age: z.array(z.nativeEnum(Age)),
  dogsNotGoodWith: z.array(z.nativeEnum(GoodWith)),
  medical: z.array(z.nativeEnum(Medical)),
  behavioral: z.array(z.nativeEnum(Behavioral)),
});

function ConfirmModal({ editing }: { editing: boolean }) {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const urlDest = useRef<Url>();
  const proceed = useRef<boolean>();

  useEffect(() => {
    const warningText = "Discard unsaved changes?";
    const handleWindowClose = (e: BeforeUnloadEvent) => {
      if (!editing) return;
      // onOpen();
      e.preventDefault();
      return (e.returnValue = warningText);
    };
    const handleBrowseAway = (url: Url) => {
      if (!editing) return;
      urlDest.current = url;
      if (proceed.current) return;
      onOpen();
      router.events.emit("routeChangeError");
      throw "routeChange aborted.";
    };
    window.addEventListener("beforeunload", handleWindowClose);
    router.events.on("routeChangeStart", handleBrowseAway);

    return () => {
      window.removeEventListener("beforeunload", handleWindowClose);
      router.events.off("routeChangeStart", handleBrowseAway);
    };
  }, [editing]);

  return (
    <AlertDialog
      leastDestructiveRef={cancelRef}
      isOpen={isOpen}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>Leave Page</AlertDialogHeader>
          <AlertDialogBody>
            Are you sure? Unsaved changes will be lost.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={() => onClose()}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                proceed.current = true;
                router.push(urlDest.current as Url).catch((err) => {
                  console.log(err);
                });
              }}
              colorScheme="red"
              ml={3}
            >
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

function Profile() {
  const { user, userData, refetchUserData } = useAuth();
  const [editing, setEditing] = useState(false);
  const toast = useToast();

  function pruneUserData(
    data: NonNullable<typeof userData>
  ): Pick<IUser, OptionalKeys<IUser>> {
    const {
      email,
      uid,
      role,
      disabled,
      hasCompletedOnboarding,
      ...initialState
    } = data;

    return {
      name: user?.displayName ?? "",
      preferredEmail: "",
      ...initialState,
    };
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

  const updatePreferences = trpc.user.updateUserPreferences.useMutation({
    onSuccess() {
      refetchUserData!();
    },
  });

  const MultiValueLabel = (props: any) => {
    return (
      <components.MultiValueLabel
        {...props}
        innerProps={{
          ...props.innerProps,
          css: { ...props.innerProps.css, paddingRight: 6 },
        }}
      />
    );
  };
  const MultiValueRemove = (props: any) => {
    if (!editing) return null;
    return <components.MultiValueRemove {...props} />;
  };

  return (
    <Flex
      display={"flex"}
      bgColor={["white", "bg-primary"]}
      justifyContent="center"
    >
      <ConfirmModal editing={editing} />
      <Flex
        display={{ base: "block", md: "none" }}
        width={"100%"}
        position={"fixed"}
        zIndex={1}
        bottom={0}
        right={0}
        left={0}
        justifyContent={"center"}
        alignItems={"center"}
        padding={5}
        bgGradient={"linear(180deg, #FFF 72.24%, #ECECEC 100%)"}
      >
        <EditButton></EditButton>
      </Flex>
      <Box
        width={["100%", "80%"]}
        p={8}
        bgColor="white"
        borderRadius={12}
        mt={[14, 100]}
        mb={[14, 50]}
      >
        <Flex w="100%" justifyContent="space-between" alignItems="center">
          <Text
            fontSize="2xl"
            fontWeight="bold"
            lineHeight="24px"
            letterSpacing="wide"
          >
            Profile
          </Text>
          <Box display={{ base: "none", md: "block" }}>
            <EditButton></EditButton>
          </Box>
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
              direction={["column", "row"]}
              spacing={10}
              alignItems="center"
            >
              <Image
                borderRadius="100%"
                boxSize={[100, 36]}
                src={user?.photoURL ?? undefined}
                alt="User photo"
              ></Image>

              <Stack
                direction={["column", "row"]}
                width={["100%", "100%"]}
                spacing={5}
              >
                <Stack direction={"column"} spacing={5} width={["100%", "50%"]}>
                  <Stack direction="column">
                    <Text fontWeight="medium">Name</Text>
                    <Input
                      value={preferences.name}
                      onChange={(e) =>
                        dispatch({
                          type: "setField",
                          key: "name",
                          data: e.target.value,
                        })
                      }
                      disabled={!editing}
                    ></Input>
                  </Stack>
                  <Stack direction="column">
                    <Text fontWeight="medium">Email</Text>
                    <Input
                      placeholder={user?.email ?? undefined}
                      disabled={true}
                    ></Input>
                  </Stack>
                </Stack>
                <Stack direction={"column"} spacing={5} width={["100%", "50%"]}>
                  <Stack direction="column">
                    <Text fontWeight="medium">Preferred Email</Text>
                    <Input
                      value={preferences.preferredEmail}
                      onChange={(e) =>
                        dispatch({
                          type: "setField",
                          key: "preferredEmail",
                          data: e.target.value,
                        })
                      }
                      disabled={!editing}
                    ></Input>
                  </Stack>
                  <Stack direction="column">
                    <Text fontWeight="medium">
                      Which types of fosters can you help with?
                    </Text>
                    <Select
                      components={{ MultiValueLabel, MultiValueRemove }}
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
              <Stack direction={["column-reverse", "row"]} spacing={5}>
                <Stack direction="column" width={["100%", "50%"]}>
                  <Text fontWeight="medium">Breed Restrictions</Text>
                  <Select
                    components={{ MultiValueLabel, MultiValueRemove }}
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
                <Stack direction="column" width={["100%", "50%"]}>
                  <Text fontWeight="medium">Breed Preferences</Text>
                  <Select
                    components={{ MultiValueLabel, MultiValueRemove }}
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
              <Stack direction={["column-reverse", "row"]} spacing={5}>
                <Stack direction="column" width={["100%", "50%"]}>
                  <Text fontWeight="medium">Age Capability</Text>
                  <Select
                    components={{ MultiValueLabel, MultiValueRemove }}
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
                <Stack direction="column" width={["100%", "50%"]}>
                  <Text fontWeight="medium">Dog Size Capability</Text>
                  <Select
                    components={{ MultiValueLabel, MultiValueRemove }}
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
              <Stack direction="row" spacing={[0, 5]}>
                <Stack direction="column" width={["100%", "50%"]}>
                  <Text fontWeight="medium">Gender Capability</Text>
                  <Select
                    components={{ MultiValueLabel, MultiValueRemove }}
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
                <Stack direction="column" width={["none", "50%"]}></Stack>
              </Stack>
            </Stack>
          </Section>
          <Section heading="Behavioral Traits">
            <Stack direction="column" w="100%" spacing={5}>
              <Stack direction={["column", "row"]} spacing={5}>
                <Stack direction="column" width={["100%", "50%"]}>
                  <Text fontWeight="medium">
                    Able to foster dogs NOT good with:
                  </Text>
                  <Select
                    components={{ MultiValueLabel, MultiValueRemove }}
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
                <Stack direction="column" width={["100%", "50%"]}>
                  <Text fontWeight="medium">Able to foster dogs with:</Text>
                  <Select
                    components={{ MultiValueLabel, MultiValueRemove }}
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
            </Stack>
          </Section>
          <Section heading="Medical Information">
            <Stack direction="column" width="100%" spacing={5}>
              <Stack direction={["column", "row"]} spacing={5}>
                <Stack direction="column" width={["100%", "50%"]}>
                  <Text fontWeight="medium">Medical Capability</Text>
                  <Select
                    components={{ MultiValueLabel, MultiValueRemove }}
                    isMulti
                    onChange={(newVals) =>
                      dispatch({
                        type: "setField",
                        key: "medical",
                        data: (
                          newVals as {
                            value: Medical;
                            label: string;
                          }[]
                        ).map(({ value }) => value),
                      })
                    }
                    value={preferences?.medical?.map((medical) => ({
                      value: medical as string,
                      label: medicalLabels[medical],
                    }))}
                    isDisabled={!editing}
                    options={Object.entries(medicalLabels).map(
                      ([key, val]) => ({ value: key, label: val })
                    )}
                  />
                </Stack>
                <Stack direction="column" width={["100%", "50%"]}></Stack>
              </Stack>
            </Stack>
          </Section>
        </Stack>
      </Box>
    </Flex>
  );

  function EditButton() {
    return !editing ? (
      <Button
        variant="solid-primary"
        onClick={() => setEditing(true)}
        width={"100%"}
      >
        Edit
      </Button>
    ) : (
      <Stack direction="row">
        <Button
          variant="outline-secondary"
          fontWeight="thin"
          borderWidth="thin"
          width={["50%", "100%"]}
          onClick={() => {
            dispatch({ type: "clear" });
            setEditing(false);
          }}
        >
          Cancel
        </Button>
        <Button
          variant="solid-primary"
          width={["50%", "100%"]}
          onClick={async () => {
            const parse = profileSchema.safeParse(preferences);
            if (!parse.success) {
              toast({
                title: "Error",
                description: parse.error.issues
                  .map((issue) => issue.message)
                  .join("\r\n"),
                containerStyle: {
                  whiteSpace: "pre-line",
                },
                status: "error",
                duration: 4000,
                isClosable: true,
                position: "top",
              });
              return;
            }
            const prunedPreferences = { ...preferences };
            Object.keys(prunedPreferences).forEach(
              (k) =>
                prunedPreferences[k as OptionalKeys<IUser>] === "" &&
                delete prunedPreferences[k as OptionalKeys<IUser>]
            );

            const req = await updatePreferences.mutateAsync({
              uid: userData!.uid,
              updateFields: prunedPreferences,
            });
            if (req.success) {
              setEditing(false);
            } else {
              toast({
                title: "Request unsuccessful",
                status: "error",
                duration: 4000,
                isClosable: true,
                position: "top",
              });
            }
          }}
        >
          Save
        </Button>
      </Stack>
    );
  }
}

export default pageAccessHOC(Profile);
