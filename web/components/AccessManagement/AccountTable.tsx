import { useState, SetStateAction, Dispatch } from "react";
import { IAccount } from "../../utils/types/account";
import AccountCard from "./AccountCard";
import { SimpleGrid, Stack } from "@chakra-ui/react";
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
        spacing={4}
        columns={{ sm: 1, md: 1, lg: 2 }}
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
    </Stack>
  );
}

export default AccountTable;
