import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  Spacer,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react";
import {
  ageLabels,
  breedLabels,
  fosterTypeLabels,
  genderLabels,
  medicalLabels,
  sizeLabels,
  goodWithLabels,
  behavioralLabels,
  FosterType,
  Size,
  Breed,
  Gender,
  Age,
  GoodWith,
  Medical,
  Behavioral,
} from "../../utils/types/post";
import Select from "react-select";
import { ReducerAction } from "../../pages/users";
import { Dispatch, SetStateAction } from "react";
import { SearchUsersParams } from "../../db/actions/User";
import { ArrowForwardIcon } from "@chakra-ui/icons";

function Filter(props: {
  desc: string;
  children: JSX.Element | JSX.Element[];
  width?: string[] | string;
}): JSX.Element {
  return (
    <Flex direction="column" width={props.width ?? "100%"} height="100%">
      <Text>{props.desc}</Text>
      <Spacer />
      {props.children}
    </Flex>
  );
}

type SearchProps = {
  filters: SearchUsersParams;
  dispatch: Dispatch<ReducerAction>;
  setSearched: Dispatch<SetStateAction<boolean>>;
};

export default function Search({
  filters,
  dispatch,
  setSearched,
}: SearchProps) {
  return (
    <Flex
      direction="column"
      width="100%"
      height="100%"
      padding={5}
      overflowY="auto"
      align="center"
      gap={5}
    >
      <Heading size="md">Search by Filters</Heading>
      <Box
        outline="2px solid gray"
        borderRadius={20}
        flex="1"
        padding={5}
        width="100%"
      >
        <Stack align="center" marginBottom={15}>
          <Text>Filter Options</Text>
          <Divider borderColor="gray.400" />
          <Text alignSelf="start">
            Fill out at least one field to filter for volunteers that match
            those options:
          </Text>
        </Stack>
        <Stack
          direction="column"
          spacing={5}
          divider={<StackDivider borderColor="gray.200" />}
        >
          <Stack width="100%" direction={["column", "row"]} spacing={5}>
            <Stack direction="column" width={["100%", "50%"]}>
              <Heading size="md">General Information</Heading>
              <Flex direction={["column", "row"]}>
                <Filter desc="Foster Type" width="100%">
                  <Select
                    closeMenuOnSelect={false}
                    isMulti
                    options={Object.entries(fosterTypeLabels).map(
                      ([key, val]) => ({
                        value: key,
                        label: val,
                      })
                    )}
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
                    value={filters?.type?.map((type) => ({
                      value: type as string,
                      label: fosterTypeLabels[type],
                    }))}
                    placeholder={`Ex: ${fosterTypeLabels.temporary}`}
                  />
                </Filter>
              </Flex>
            </Stack>
            <Stack direction="column" width={["100%", "50%"]}>
              <Heading size="md">Medical Information</Heading>
              <Flex direction={["column", "row"]}>
                <Filter
                  desc="Able to foster dogs with these medical issues:"
                  width="100%"
                >
                  <Select
                    closeMenuOnSelect={false}
                    isMulti
                    options={Object.entries(medicalLabels).map(
                      ([key, val]) => ({
                        value: key,
                        label: val,
                      })
                    )}
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
                    value={filters?.medical?.map((medical) => ({
                      value: medical as string,
                      label: medicalLabels[medical],
                    }))}
                    placeholder={`Ex: ${medicalLabels.parvo}`}
                  />
                </Filter>
              </Flex>
            </Stack>
          </Stack>
          <Stack direction="column" width="100%">
            <Heading size="md">Physical Traits</Heading>
            <Grid templateColumns={["1fr", "1fr 1fr"]} gap={5}>
              <GridItem>
                <Filter desc="Has these breed preferences:">
                  <Select
                    closeMenuOnSelect={false}
                    isMulti
                    options={Object.entries(breedLabels).map(([key, val]) => ({
                      value: key,
                      label: val,
                    }))}
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
                    value={filters?.preferredBreeds?.map((breed) => ({
                      value: breed as string,
                      label: breedLabels[breed],
                    }))}
                    placeholder={`Ex: ${breedLabels.australianShepherd}`}
                  />
                </Filter>
              </GridItem>
              <GridItem>
                <Filter desc="Age Capability:">
                  <Select
                    closeMenuOnSelect={false}
                    isMulti
                    options={Object.entries(ageLabels).map(([key, val]) => ({
                      value: key,
                      label: val,
                    }))}
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
                    value={filters?.age?.map((age) => ({
                      value: age as string,
                      label: ageLabels[age],
                    }))}
                    placeholder={`Select an age category...`}
                  />
                </Filter>
              </GridItem>
              <GridItem>
                <Filter desc="Dog Size Capability:">
                  <Select
                    closeMenuOnSelect={false}
                    isMulti
                    options={Object.entries(sizeLabels).map(([key, val]) => ({
                      value: key,
                      label: val,
                    }))}
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
                    value={filters?.size?.map((size) => ({
                      value: size as string,
                      label: sizeLabels[size],
                    }))}
                    placeholder={`Select a dog size category...`}
                  />
                </Filter>
              </GridItem>
              <GridItem>
                <Filter desc="Gender Capability:">
                  <Select
                    closeMenuOnSelect={false}
                    isMulti
                    options={Object.entries(genderLabels).map(([key, val]) => ({
                      value: key,
                      label: val,
                    }))}
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
                    value={filters?.gender?.map((gender) => ({
                      value: gender as string,
                      label: genderLabels[gender],
                    }))}
                    placeholder={`Select a gender category...`}
                  />
                </Filter>
              </GridItem>
            </Grid>
          </Stack>
          <Stack direction="column" width="100%">
            <Heading size="md">Behavioral Traits</Heading>
            <Grid templateColumns={["1fr", "1fr 1fr"]} gap={5}>
              <GridItem>
                <Filter desc="Able to foster dogs NOT good with:">
                  <Select
                    closeMenuOnSelect={false}
                    isMulti
                    options={Object.entries(goodWithLabels).map(
                      ([key, val]) => ({ value: key, label: val })
                    )}
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
                    value={filters?.dogsNotGoodWith?.map((goodWith) => ({
                      value: goodWith as string,
                      label: goodWithLabels[goodWith],
                    }))}
                    placeholder={`Ex: ${goodWithLabels.women}`}
                  />
                </Filter>
              </GridItem>
              <GridItem>
                <Filter desc="Able to foster dogs with these behavioral issues:">
                  <Select
                    closeMenuOnSelect={false}
                    isMulti
                    options={Object.entries(behavioralLabels).map(
                      ([key, val]) => ({ value: key, label: val })
                    )}
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
                    value={filters?.behavioral?.map((b) => ({
                      value: b as string,
                      label: behavioralLabels[b],
                    }))}
                    placeholder={`Ex: ${behavioralLabels.separationAnxiety}`}
                  />
                </Filter>
              </GridItem>
            </Grid>
          </Stack>
          <Flex
            width="100%"
            direction={["column", "row"]}
            gap={5}
            justifyContent="end"
          >
            <Button
              onClick={() => {
                dispatch({ type: "clear" });
              }}
              variant="outline-secondary"
              width={["100%", "min-content"]}
              paddingX={20}
            >
              Clear
            </Button>
            <Button
              onClick={() => setSearched(true)}
              variant="solid-primary"
              width={["100%", "min-content"]}
              paddingX={20}
              rightIcon={<ArrowForwardIcon />}
            >
              Find Volunteers
            </Button>
          </Flex>
        </Stack>
      </Box>
    </Flex>
  );
}
