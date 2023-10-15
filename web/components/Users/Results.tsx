import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
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

  return (
    <Flex
      direction="column"
      display="flex"
      width="100%"
      height="100%"
      padding={5}
      overflowY="auto"
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
      <Box outline="2px solid gray" borderRadius={20} padding={5} width="100%">
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

      <Flex
        width="100%"
        direction="row"
        wrap="wrap"
        gap={5}
        justifyContent="center"
      >
        {users?.data?.data?.map((user) => (
          <Box
            key={user.uid}
            outline="1px solid gray"
            borderRadius={10}
            padding={2}
            justifyContent="center"
            overflowX="auto"
            width={["100%", "400px"]}
          >
            <Flex direction="column">
              <Heading size="md">{user.name}</Heading>
              <Text whiteSpace="nowrap" textOverflow="ellipsis">
                <b>Email: </b>
                {user.email}
              </Text>
              <Text whiteSpace="nowrap" textOverflow="ellipsis">
                <b>Preferred Email: </b>
                {user.preferredEmail ?? user.email}
              </Text>
            </Flex>
          </Box>
        ))}
      </Flex>
    </Flex>
  );
}
