import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Button,
  Center,
  Divider,
  Flex,
  Grid,
  Image,
  GridItem,
  Heading,
  Spinner,
  Stack,
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

const keyLabels: Record<keyof SearchUsersParams, string> = {
  type: "Foster type",
  size: "Size",
  preferredBreeds: "Preferred breeds",
  gender: "Gender",
  age: "Age",
  dogsNotGoodWith: "Able to foster dogs not good with",
  medical: "Medical",
  behavioral: "Behavioral",
};

const filterLabels: Record<keyof SearchUsersParams, Record<any, string>> = {
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
    <Flex
      backgroundColor="tag-primary-bg"
      paddingX={2}
      paddingY={1}
      borderRadius={8}
      fontSize="14px"
    >
      {props.children}
    </Flex>
  );
}

export default function Results({ filters, setSearched }: ResultsProps) {
  const { isLoading, data: users } = trpc.user.searchUsers.useQuery({
    searchParams: filters,
  });

  if (isLoading) {
    return (
      <Center w="100%" h="100%">
        <Spinner size="xl" />
      </Center>
    );
  }

  const flattenedFilters = Object.entries(filters).filter(
    ([_, v]) => v.length !== 0
  );

  return (
    <Flex direction="column" w="100%" h="100%" gap={5}>
      <Stack spacing={5} w="100%">
        <Heading size="lg" alignSelf="start">
          Search Results
        </Heading>
        <Text>Showing results for the following search criteria:</Text>
        {flattenedFilters.length > 0 ? (
          <Flex gap={2} wrap="wrap">
            {flattenedFilters.map(([k, v]) => (
              <Label key={k}>
                <Text fontWeight="semibold" pr={1}>
                  {`${keyLabels[k as keyof SearchUsersParams]}:`}
                </Text>
                <Text>
                  {v
                    .map(
                      (filter: PossibleTypes) =>
                        filterLabels[k as keyof SearchUsersParams][filter]
                    )
                    .join(", ")}
                </Text>
              </Label>
            ))}
          </Flex>
        ) : (
          <Text fontStyle="italic">No filters selected</Text>
        )}
        <Divider />
      </Stack>
      {(!users || !users.data || users.data.length == 0) && (
        <Text align={"center"}>No results found.</Text>
      )}
      <Flex maxW="100%" flex={1} overflowY="scroll">
        <Grid
          gridTemplateColumns={["1fr", "repeat(auto-fit, minmax(300px, 1fr))"]}
          gap={5}
          justifyContent="center"
          w="100%"
        >
          {users?.data?.map((user) => (
            <GridItem
              key={user.uid}
              display="flex"
              alignItems="stretch"
              border="1px solid"
              borderColor="gray.300"
              borderRadius={12}
              padding={2}
              h="fit-content"
            >
              <Grid
                templateColumns={{
                  base: "0 max-content",
                  sm: "1fr max-content",
                }}
                gap={2}
              >
                <GridItem h={0} minHeight="100%">
                  <Image
                    w="100%"
                    h="100%"
                    borderRadius={100}
                    src={user.picture ?? "/profile.jpeg"}
                    objectFit="cover"
                  />
                </GridItem>
                <GridItem wordBreak="break-all">
                  <Heading size="sm">{user.name ?? "Volunteer"}</Heading>
                  <Text fontSize="sm" wordBreak="break-all">
                    <b>Email: </b>
                    {user.email}
                  </Text>
                  <Text fontSize="sm">
                    <b>Preferred Email: </b>
                    {user.preferredEmail ?? "Unspecified"}
                  </Text>
                </GridItem>
              </Grid>
            </GridItem>
          ))}
        </Grid>
      </Flex>
      <Button
        alignSelf="flex-start"
        onClick={() => setSearched(false)}
        leftIcon={<ArrowBackIcon />}
        variant="outline-secondary"
      >
        Back to search
      </Button>
    </Flex>
  );
}
