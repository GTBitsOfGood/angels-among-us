import CreateAccountForm from "../components/AccessManagement/CreateAccountForm";
import AccountTable from "../components/AccessManagement/AccountTable";
import { useState } from "react";
import { Text, Flex, Spinner, Box } from "@chakra-ui/react";
import { trpc } from "../utils/trpc";
import pageAccessHOC from "../components/HOC/PageAccess";
import useDebounce from "../hooks/useDebounce";

function Access() {
  const [selectItems, updateSelectItems] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const searchQuery = useDebounce<string>(search, 400);
  const accounts = trpc.account.search.useQuery({ searchSubject: searchQuery });

  return (
    <Flex
      bgColor="#D7E4EE"
      flexDir="row"
      justifyContent="center"
      minHeight="100%"
      maxHeight={"max-content"}
      width="100vw"
    >
      <Flex
        bgColor="white"
        direction="column"
        alignItems="center"
        justifyContent={"flex-start"}
        paddingTop={6}
        marginTop={"95px"}
        marginX={{ sm: "20px", md: "100px", lg: "170px" }}
        gap={[4, 4, 0.05]}
        minHeight={"100vh"}
        maxHeight={"max-content"}
        width="inherit%"
        borderRadius={"12px 12px 0 0"}
        boxShadow="0px 4px 20px 2px rgba(0, 0, 0, 0.1);"
      >
        <Box w="100%" textAlign="center">
          <Text
            fontSize="xl"
            fontWeight="600"
            lineHeight="24px"
            letterSpacing="wide"
          >
            Accounts List
          </Text>
        </Box>
        <CreateAccountForm
          updateSelectItems={updateSelectItems}
        ></CreateAccountForm>
        {!(accounts.data?.length === 0) ? (
          <AccountTable
            accountList={accounts.data ?? []}
            selectItems={selectItems}
            updateSelectItems={updateSelectItems}
            search={search}
            setSearch={setSearch}
          />
        ) : (
          <Spinner></Spinner>
        )}
      </Flex>
    </Flex>
  );
}

export default pageAccessHOC(Access);
