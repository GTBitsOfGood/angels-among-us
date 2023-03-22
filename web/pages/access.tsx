import CreateAccountForm from "../components/AccessManagement/CreateAccountForm";
import AccountTable from "../components/AccessManagement/AccountTable";
import { useState } from "react";
import { Text, Box, Flex, Center } from "@chakra-ui/react";
import { IAccount } from "../utils/types/account";
import { Role } from "../utils/types/account";
import pageAccessHOC from "../components/HOC/PageAccess";

function Access() {
  const [accountList, updateAccountList] = useState<IAccount[]>([
    {
      email: "exmpleaddress1@domainname.com",
      role: Role.Admin,
    },
    {
      email: "exmpleaddress2@domainname.com",
      role: Role.Volunteer,
    },
    {
      email: "exmpleaddress3@domainname.com",
      role: Role.ContentCreator,
    },
    {
      email: "exmpleaddress4@domainname.com",
      role: Role.Admin,
    },
    {
      email: "exmpleaddress5@domainname.com",
      role: Role.Volunteer,
    },
  ]);
  const [selectItems, updateSelectItems] = useState<boolean>(false);

  return (
    <Flex
      direction="row"
      justifyContent="center"
      w="100%"
      h="100%"
      bgColor="#dfdfdf"
    >
      <Flex
        bgColor="white"
        direction="column"
        marginTop={{ base: "10px", md: "50px", lg: "100px" }}
        width={["100%", "80%"]}
        alignItems="center"
        paddingTop={6}
      >
        <Text fontSize="lg" fontWeight="semibold" lineHeight="24px">
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
  );
}

export default pageAccessHOC(Access);
