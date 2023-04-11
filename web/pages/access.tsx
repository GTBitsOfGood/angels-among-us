import CreateAccountForm from "../components/AccessManagement/CreateAccountForm";
import AccountTable from "../components/AccessManagement/AccountTable";
import { useState } from "react";
import { Text, Flex, Spinner, Box, Center } from "@chakra-ui/react";
import { IAccount } from "../utils/types/account";
import { trpc } from "../utils/trpc";
import { HydratedDocument } from "mongoose";
import { Role } from "../utils/types/account";
import pageAccessHOC from "../components/HOC/PageAccess";

function Access() {
  const [accountList, updateAccountList] = useState<
    HydratedDocument<IAccount>[]
  >([]);

  const [selectItems, updateSelectItems] = useState<boolean>(false);

  const accounts = trpc.account.getAll.useQuery(undefined, {
    onSuccess: (data: HydratedDocument<IAccount>[]) => {
      if (data) {
        updateAccountList(data);
      }
    },
    retry: 1,
  });

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
          accountList={accountList}
          updateAccountList={updateAccountList}
          updateSelectItems={updateSelectItems}
        ></CreateAccountForm>
        {!(accountList.length === 0) ? (
          <AccountTable
            accountList={accountList}
            updateAccountList={updateAccountList}
            selectItems={selectItems}
            updateSelectItems={updateSelectItems}
          ></AccountTable>
        ) : (
          <Spinner></Spinner>
        )}
      </Flex>
    </Flex>
  );
}

export default pageAccessHOC(Access);
