import { useState, SetStateAction, Dispatch, useEffect } from "react";
import { IAccount } from "../../utils/types/account";
import AccountCard from "./AccountCard";
import { Stack, SimpleGrid, Grid, GridItem, Center } from "@chakra-ui/react";
import TableHeader from "./TableHeader";

interface PropertyType {
  accountList: IAccount[];
  updateAccountList: Dispatch<SetStateAction<IAccount[]>>;
  selectItems: boolean;
  updateSelectItems: Dispatch<SetStateAction<boolean>>;
}

function AccountTable(props: PropertyType) {
  const { accountList, updateAccountList, selectItems, updateSelectItems } =
    props;
  const [itemsToDelete, updateItemsToDelete] = useState<Number[]>([]);

  useEffect(() => {
    if (!selectItems) {
      updateItemsToDelete([]);
    }
  }, [selectItems]);

  return (
    <Stack
      gap={"15px"}
      width="100%"
      alignItems={"center"}
      paddingBottom={"20px"}
    >
      <TableHeader
        selectItems={selectItems}
        updateSelectItems={updateSelectItems}
        itemsToDelete={itemsToDelete}
        updateItemsToDelete={updateItemsToDelete}
        accountList={accountList}
        updateAccountList={updateAccountList}
      ></TableHeader>
      <Grid
        paddingX={"20px"}
        templateColumns={{
          sm: "repeat(2, 1fr)",
          md: "repeat(2, 1fr)",
          lg: "repeat(4, 1fr)",
        }}
        gap={"20px"}
        width={"inherit"}
      >
        {accountList.map((e: IAccount) => {
          return (
            <GridItem
              colSpan={{ sm: 1, md: 1, lg: 2 }}
              alignItems={"center"}
              key={accountList.indexOf(e)}
            >
              <AccountCard
                account={e}
                idx={accountList.indexOf(e)}
                key={accountList.indexOf(e)}
                selectItems={selectItems}
                itemsToDelete={itemsToDelete}
                updateItemsToDelete={updateItemsToDelete}
                accountList={accountList}
                updateAccountList={updateAccountList}
              ></AccountCard>
            </GridItem>
          );
        })}
      </Grid>
    </Stack>
  );
}

export default AccountTable;
