import CreateAccountForm from "../components/AccessManagement/CreateAccountForm";
import AccountTable from "../components/AccessManagement/AccountTable";
import { useRef, useState } from "react";
import { Text, Flex, Box } from "@chakra-ui/react";
import { trpc } from "../utils/trpc";
import pageAccessHOC from "../components/HOC/PageAccess";
import useDebounce from "../hooks/useDebounce";
import TableHeader from "../components/AccessManagement/TableHeader";

function Access() {
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [searchQuery, isUpdating] = useDebounce<string>(search, 400);
  const selectedAccounts = useRef<Set<string>>(new Set([]));
  const accounts = trpc.account.search.useQuery({ searchSubject: searchQuery });

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
        <Box
          w="100%"
          p={{ base: 4, lg: 6 }}
          bgColor="white"
          borderRadius={{ base: 0, lg: 12 }}
          mb={{ base: 0, lg: 10 }}
        >
          <Text
            fontSize="xl"
            fontWeight="semibold"
            lineHeight="24px"
            letterSpacing="wide"
            alignSelf="left"
          >
            Add New Account
          </Text>
          <Flex>
            <CreateAccountForm />
          </Flex>
        </Box>
        <Flex direction="column" w="100%" h="100%" overflowY="hidden">
          <TableHeader
            selectedAccounts={selectedAccounts}
            isSelecting={isSelecting}
            setIsSelecting={setIsSelecting}
            search={search}
            setSearch={setSearch}
          />
          <AccountTable
            accountList={accounts.data}
            isLoading={isUpdating || accounts.isLoading}
            isSelecting={isSelecting}
            selectedAccounts={selectedAccounts}
          />
        </Flex>
      </Flex>
    </Flex>
  );
}

export default pageAccessHOC(Access);
