import CreateAccountForm from "../components/AccessManagement/CreateAccountForm";
import AccountTable from "../components/AccessManagement/AccountTable";
import { useEffect, useState } from "react";
import { Text, Box, Flex, Center, Spinner } from "@chakra-ui/react";
import { IAccount } from "../utils/types/account";
import { trpc } from "../utils/trpc";

export default function Access() {
  const accounts = trpc.account.getAll.useQuery();
  console.log(accounts.data);
  const [accountList, updateAccountList] = useState<IAccount[]>([]);
  const [selectItems, updateSelectItems] = useState<boolean>(false);

  return (
    <Flex
      bgColor="#EEEEEE"
      flexDir="column"
      alignItems={"center"}
      height={"100vh"}
    >
      <Flex
        flexDir="column"
        alignItems="center"
        display={["flex"]}
        marginX={{ base: "none", md: "100px", lg: "170px" }}
        marginTop={"95px"}
        height={"100%"}
      >
        <Flex
          bgColor="#FFFFFF"
          direction="column"
          width="100%"
          alignItems="center"
          justifyContent={"flex-start"}
          paddingTop={6}
          gap={[4, 4, 0.05]}
          minHeight={"80vh"}
          borderRadius={"6px"}
        >
          <Text fontSize="24px" fontWeight="600" lineHeight="24px">
            Accounts List
          </Text>
          <CreateAccountForm
            accountList={accountList}
            updateAccountList={updateAccountList}
            updateSelectItems={updateSelectItems}
          ></CreateAccountForm>
          <AccountTable
            accountList={accountList}
            updateAccountList={updateAccountList}
            selectItems={selectItems}
            updateSelectItems={updateSelectItems}
          ></AccountTable>
        </Flex>
      </Flex>
    </Flex>
  );
}
