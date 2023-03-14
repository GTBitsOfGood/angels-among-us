import CreateAccountForm from "../components/AccessManagement/CreateAccountForm";
import AccountTable from "../components/AccessManagement/AccountTable";
import { useEffect, useState } from "react";
import { Text, Flex, Spinner } from "@chakra-ui/react";
import { IAccount } from "../utils/types/account";
import { trpc } from "../utils/trpc";

export default function Access() {
  const accounts = trpc.account.getAll.useQuery();
  console.log("ACCOUNTS");
  console.log(accounts);

  const [accountList, updateAccountList] = useState<IAccount[]>([]);
  const [selectItems, updateSelectItems] = useState<boolean>(false);

  //   useEffect(() => {
  //     var temp = accounts.data as IAccount[];
  //     updateAccountList(accounts.data)
  //   }, [accounts])

  return (
    <Flex
      bgColor="#EEEEEE"
      flexDir="column"
      alignItems={"center"}
      minHeight="100%"
      maxHeight={"max-content"}
      width="100vw"
    >
      <Flex>
        <Flex
          bgColor="#FFFFFF"
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
          {accountList != null ? (
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
    </Flex>
  );
}
