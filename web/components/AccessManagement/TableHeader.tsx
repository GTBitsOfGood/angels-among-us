import { Flex, Input, Box, Text } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";
import { IAccount } from "../../utils/types/account";
import DeletePopup from "./DeletePopup";

interface PropertyType {
  accountList: IAccount[];
  updateAccountList: Dispatch<SetStateAction<IAccount[]>>;
  selectItems: boolean;
  updateSelectItems: Dispatch<SetStateAction<boolean>>;
  itemsToDelete: Number[];
  updateItemsToDelete: Dispatch<SetStateAction<Number[]>>;
}
function TableHeader(props: PropertyType) {
  const {
    accountList,
    updateAccountList,
    selectItems,
    updateSelectItems,
    itemsToDelete,
    updateItemsToDelete,
  } = props;

  function toggleSelect() {
    updateSelectItems(!selectItems);
    updateItemsToDelete([]);
  }

  return (
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
            <Text fontSize="16" fontWeight="400" lineHeight="19px">
              Cancel
            </Text>
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
          <Text fontSize="16" fontWeight="400" lineHeight="19px">
            Select Items
          </Text>
        </Box>
      )}
    </Flex>
  );
}

export default TableHeader;
