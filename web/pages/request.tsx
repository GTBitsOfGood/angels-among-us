import { Flex } from "@chakra-ui/react";
import { trpc } from "../utils/trpc";
import pageAccessHOC from "../components/HOC/PageAccess";
import RequestTable from "../components/RequestManagement/RequestTable";

function Request() {
  const requestedUsers = trpc.user.getUnverifiedUsers.useQuery();

  return (
    <Flex
      direction="column"
      bgColor={{ base: "white", lg: "bg-primary" }}
      w="100%"
      pt={{ base: "65px", lg: 100 }}
      pb={{ base: 0, lg: 50 }}
      h="100%"
      alignItems="center"
    >
      <Flex
        direction="column"
        alignItems="center"
        w={{ base: "100%", lg: "80%" }}
        h="100%"
      >
        <Flex direction="column" w="100%" h="100%" overflowY="hidden">
          <RequestTable
            requestedUserList={requestedUsers.data}
            isLoading={requestedUsers.isLoading}
          />
        </Flex>
      </Flex>
    </Flex>
  );
}

export default pageAccessHOC(Request);
