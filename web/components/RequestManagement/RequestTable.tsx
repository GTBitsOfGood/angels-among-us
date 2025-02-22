import RequestedUserCard from "./RequestedUserCard";
import { Grid, GridItem, Spinner, Text, Center, Box } from "@chakra-ui/react";
import { IUser } from "../../utils/types/user";

interface PropertyType {
  requestedUserList: IUser[] | undefined;
  isLoading: boolean;
}

function RequestTable(props: PropertyType) {
  const { requestedUserList, isLoading } = props;

  if (isLoading) {
    return (
      <Center w="100%" h="100%" bgColor="white" borderRadius="0 0 12px 12px">
        <Spinner size="lg" />
      </Center>
    );
  }

  if (requestedUserList && requestedUserList.length > 0) {
    return (
      <Box
        w="100%"
        h="100%"
        bgColor="white"
        overflowY="auto"
        pt={3}
        pb={6}
        borderRadius="0 0 12px 12px"
      >
        <Grid
          w="100%"
          templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }}
          columnGap={6}
          paddingX={6}
        >
          {requestedUserList.map((requestedUser) => {
            return (
              <GridItem
                bgColor="white"
                paddingY={3}
                borderBottom="1px solid #E2E8F0"
                alignItems="center"
                key={requestedUser.email}
              >
                <RequestedUserCard user={requestedUser} />
              </GridItem>
            );
          })}
        </Grid>
      </Box>
    );
  }

  return (
    <Center w="100%" h="100%" bgColor="white" borderRadius="0 0 12px 12px">
      <Text>No results found.</Text>
    </Center>
  );
}

export default RequestTable;
