import CreateAccountForm from "../components/AccessManagement/CreateAccountForm";
import AccountTable from "../components/AccessManagement/AccountTable";
import { useState } from "react";
import { Text, Box, Stack, Grid, Flex } from "@chakra-ui/react";
import { IAccount } from "../utils/types/account";
import { Role } from "../utils/types/account";

export default function Access() {
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

  return (
    <Flex bgColor="#EEEEEE">
      <Flex
        flexDir="column"
        alignItems="center"
        display={["none", "flex"]}
        marginX={{ base: "none", md: "100px", lg: "170px" }}
        marginTop={{ base: "10px", md: "50px", lg: "100px" }}
      >
        <Box
          position="absolute"
          width="100%"
          height="56px"
          left="0px"
          top="0px"
          bgColor="#B6B6B6"
        ></Box>
        <Box>
          <Flex
            bgColor="#FFFFFF"
            direction="column"
            width="100%"
            alignItems="center"
            justifyContent="center"
            paddingTop={6}
          >
            <Text fontSize="lg" fontWeight="semibold" lineHeight="24px">
              Accounts List
            </Text>
            <CreateAccountForm
              accountList={accountList}
              updateAccountList={updateAccountList}
            ></CreateAccountForm>
            <AccountTable
              accountList={accountList}
              updateAccountList={updateAccountList}
            ></AccountTable>
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
}
