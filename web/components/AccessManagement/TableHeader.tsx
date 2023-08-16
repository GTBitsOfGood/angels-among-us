import { Flex, Input, Button } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";
import { IAccount } from "../../utils/types/account";
import DeletePopup from "./DeletePopup";

interface PropertyType {
  accountList: IAccount[];
  selectItems: boolean;
  updateSelectItems: Dispatch<SetStateAction<boolean>>;
  itemsToDelete: Number[];
  updateItemsToDelete: Dispatch<SetStateAction<Number[]>>;
}
function TableHeader(props: PropertyType) {
  const {
    accountList,
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
      bgColor="#57A0D5"
      padding={4}
      gap={2}
      width={"inherit"}
    >
      <Input
        variant="filled"
        type="text"
        placeholder="Search"
        bg="white"
        borderRadius={12}
        border="1px solid white"
        height="36px"
        maxWidth="400px"
        minWidth={9}
        _focus={{ bg: "white" }}
      ></Input>
      {selectItems ? (
        <Flex flexDirection="row" gap={2}>
          <Button
            variant="outline-secondary"
            bg="white"
            borderWidth="thin"
            fontWeight="thin"
            onClick={toggleSelect}
          >
            Cancel
          </Button>
          <DeletePopup
            accountList={accountList}
            itemsToDelete={itemsToDelete}
            updateItemsToDelete={updateItemsToDelete}
            updateSelectItems={updateSelectItems}
          ></DeletePopup>
        </Flex>
      ) : (
        <Button variant="outline-primary-inverted" onClick={toggleSelect}>
          Select Items
        </Button>
      )}
    </Flex>
  );
}

export default TableHeader;
