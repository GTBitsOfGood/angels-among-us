import { useState, SetStateAction, Dispatch, useEffect } from "react";
import { IAccount } from "../../utils/types/account";
import AccountCard from "./AccountCard";
import { Stack, SimpleGrid } from "@chakra-ui/react";
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
    <Stack gap={2} w="100%">
      <TableHeader
        selectItems={selectItems}
        updateSelectItems={updateSelectItems}
        itemsToDelete={itemsToDelete}
        updateItemsToDelete={updateItemsToDelete}
        accountList={accountList}
        updateAccountList={updateAccountList}
      ></TableHeader>

      <SimpleGrid
        columns={{ sm: 1, md: 2 }}
        gap={"15px"}
        padding={{ sm: "15px", md: "20px" }}
        bgColor="white"
      >
        {accountList.map((e: IAccount) => {
          return (
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
          );
        })}
      </SimpleGrid>
      {/* </Flex> */}
    </Stack>
  );
}

export default AccountTable;
