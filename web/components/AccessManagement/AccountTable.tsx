import { MutableRefObject } from "react";
import { IAccount } from "../../utils/types/account";
import AccountCard from "./AccountCard";
import { Grid, GridItem, Spinner, Text, Center } from "@chakra-ui/react";

interface PropertyType {
  accountList: IAccount[] | undefined;
  isLoading: boolean;
  isSelecting: boolean;
  selectedAccounts: MutableRefObject<Set<string>>;
}

function AccountTable(props: PropertyType) {
  const { accountList, isLoading, isSelecting, selectedAccounts } = props;

  if (isLoading) {
    return (
      <Center w="100%" h="100%" bgColor="white" borderRadius="0 0 12px 12px">
        <Spinner size="lg" />
      </Center>
    );
  }

  if (accountList && accountList.length > 0) {
    return (
      <Grid
        bgColor="white"
        w="100%"
        templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }}
        columnGap={6}
        paddingX={6}
        pt={3}
        pb={6}
        borderRadius="0 0 12px 12px"
        overflowY="auto"
      >
        {accountList.map((account) => {
          return (
            <GridItem
              bgColor="white"
              paddingY={3}
              borderBottom="1px solid #E2E8F0"
              alignItems="center"
              key={account.email}
            >
              <AccountCard
                account={account}
                isSelecting={isSelecting}
                selectedAccounts={selectedAccounts}
              />
            </GridItem>
          );
        })}
      </Grid>
    );
  }

  return (
    <Center w="100%" h="100%" bgColor="white" borderRadius="0 0 12px 12px">
      <Text>No results found.</Text>
    </Center>
  );
}

export default AccountTable;
