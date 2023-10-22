import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  GridItem,
  Heading,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";
import { SearchUsersParams } from "../../db/actions/User";
import { PossibleTypes } from "../../pages/onboarding";
import { trpc } from "../../utils/trpc";
import {
  ageLabels,
  breedLabels,
  fosterTypeLabels,
  genderLabels,
  medicalLabels,
  sizeLabels,
  goodWithLabels,
  behavioralLabels,
} from "../../utils/types/post";

type ResultsProps = {
  filters: SearchUsersParams;
  setSearched: Dispatch<SetStateAction<boolean>>;
};

const filterLabels: Record<keyof SearchUsersParams, any> = {
  type: fosterTypeLabels,
  size: sizeLabels,
  preferredBreeds: breedLabels,
  gender: genderLabels,
  age: ageLabels,
  dogsNotGoodWith: goodWithLabels,
  medical: medicalLabels,
  behavioral: behavioralLabels,
};

function Label(props: React.PropsWithChildren): JSX.Element {
  return (
    <Text
      backgroundColor="#C6E3F9"
      width="fit-content"
      paddingX="10px"
      paddingY="5px"
      borderRadius="2"
      fontSize="14px"
    >
      {props.children}
    </Text>
  );
}

export default function Results({ filters, setSearched }: ResultsProps) {
  const users = trpc.user.searchUsers.useQuery({ searchParams: filters });
  console.log(users);

  return users.isLoading ? (
    <Center w="100%" h="100%">
      <Spinner size="xl" />
    </Center>
  ) : (
    <Flex
      direction="column"
      display="flex"
      width="100%"
      height="100%"
      padding={5}
      overflowY="auto"
      overflowX="hidden"
      align="center"
      gap={5}
      position="relative"
    >
      <Button
        onClick={() => setSearched(false)}
        position="absolute"
        left={0}
        top={0}
        leftIcon={<ArrowBackIcon />}
        variant="ghost"
        color="gray.400"
      >
        Back to Search
      </Button>
      <Heading size="md" marginTop={[3, 0]}>
        Search Results
      </Heading>
      <Box borderRadius={20} padding={5} width="100%">
        <Text>
          Showing filter results for volunteers that can handle dogs that
          are/have:
        </Text>
        <Flex gap={2} wrap="wrap">
          {Object.entries(filters).map(([k, v]) =>
            v.map((filter: PossibleTypes) => (
              <Label key={filter}>
                {filterLabels[k as keyof SearchUsersParams][filter]}
              </Label>
            ))
          )}
        </Flex>
      </Box>
      <Box
        marginTop="-20px"
        bgColor="btn-solid-primary-bg"
        height="10px"
        width="200%"
      />

      <Grid
        gridTemplateColumns={["1fr", "repeat(auto-fit, minmax(300px, 1fr))"]}
        gap={5}
        justifyContent="center"
        maxWidth="100%"
      >
        {users?.data?.data?.map((user) => (
          <GridItem
            key={user.uid}
            outline="1px solid gray"
            borderRadius={10}
            padding={2}
            justifyContent="center"
            overflowX="auto"
            width="100%"
          >
            <Flex direction="column">
              <Heading size="md">{user.name}</Heading>
              <Text wordBreak="break-all">
                <b>Email: </b>
                {user.email}
              </Text>
              <Text wordBreak="break-all">
                <b>Preferred Email: </b>
                {user.preferredEmail ?? user.email}
              </Text>
            </Flex>
          </GridItem>
        ))}
      </Grid>
    </Flex>
  );
}
