import { useState, useEffect, SetStateAction, Dispatch } from "react";
import { IAccount } from "../../utils/types/account";
import AccountCard from "./AccountCard";
import DeletePopup from "./DeletePopup";
import { Flex, SimpleGrid, Stack, Input, Box } from "@chakra-ui/react";

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
    console.log(accountList);
  }, [accountList]);

  function toggleSelect() {
    updateSelectItems(!selectItems);
    updateItemsToDelete([]);
  }

  return (
    <Stack gap={2} width="inherit">
      <Flex
        flexDirection={"row"}
        alignItems="center"
        justifyContent="space-between"
        bgColor="#D9D9D9"
        padding={4}
        gap={2}
      >
        <Input
          variant="filled"
          type="text"
          placeholder="Search"
          bgColor="#FFFFFF"
          borderRadius="16px"
          border=" 1px solid #BCBCBC"
          height="36px"
          maxWidth="400px"
          minWidth={9}
        ></Input>
        {selectItems ? (
          <Flex flexDirection="row" gap={2}>
            <Box
              as="button"
              bgColor="#F1F1F1"
              borderRadius="16px"
              maxWidth="127px"
              minWidth="70px"
              height="36px"
              onClick={toggleSelect}
            >
              Cancel
            </Box>
            <DeletePopup
              accountList={accountList}
              updateAccountList={updateAccountList}
              itemsToDelete={itemsToDelete}
              updateItemsToDelete={updateItemsToDelete}
              updateSelectItems={updateSelectItems}
            ></DeletePopup>
          </Flex>
        ) : (
          <Box
            as="button"
            bgColor="#BCBCBC"
            borderRadius="16px"
            maxWidth="208px"
            minWidth="170px"
            height="36px"
            onClick={toggleSelect}
          >
            Select Items
          </Box>
        )}
      </Flex>
      <SimpleGrid
        spacing={4}
        columns={{ sm: 1, md: 1, lg: 2 }}
        padding={{ sm: "15px", md: "20px" }}
        bgColor="#FFFFFF"
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
