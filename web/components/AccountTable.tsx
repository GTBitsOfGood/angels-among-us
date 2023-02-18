import { useState, useRef, useEffect } from "react";
import { IAccount } from "../db/models/Account";
import AccountCard from "./AccountCard";
import {
  Flex,
  SimpleGrid,
  AlertDialog,
  AlertDialogBody,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Stack,
  Input,
  Box,
  useDisclosure,
} from "@chakra-ui/react";

interface PropertyType {
  accountList: IAccount[];
  updateAccountList: Function;
}

function AccountTable(props: PropertyType) {
  const { accountList, updateAccountList } = props;
  const [itemsToDelete, updateItemsToDelete] = useState<Array<IAccount>>([]);
  const [selectItems, updateSelectItems] = useState<boolean>(false);

  useEffect(() => {
    console.log(accountList);
  }, [accountList]);

  function toggleSelect() {
    updateSelectItems(!selectItems);
    updateItemsToDelete([]);
  }

  function handleDelete() {
    var temp = accountList.filter((e) => itemsToDelete.indexOf(e) < 0);
    updateAccountList(temp);
    updateSelectItems(false);
    updateItemsToDelete([]);
  }

  function DeletePopup() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef(null);

    return (
      <>
        <Box
          onClick={onOpen}
          as="button"
          bgColor="#BCBCBC"
          borderRadius="16px"
          maxWidth="208px"
          minWidth="170px"
          height="36px"
        >
          Delete Selected Items
        </Box>
        <AlertDialog
          motionPreset="slideInBottom"
          leastDestructiveRef={cancelRef}
          onClose={onClose}
          isOpen={isOpen}
          isCentered
        >
          <AlertDialogOverlay />
          <AlertDialogContent borderRadius="30px" padding={5}>
            <AlertDialogHeader alignItems="center">
              Are you sure you want to delete the items selected?
            </AlertDialogHeader>
            <AlertDialogBody>This cannot be undone.</AlertDialogBody>
            <Flex
              flexDirection="row"
              justifyContent="center"
              alignItems="center"
            >
              <Box
                as="button"
                maxW="150px"
                minW="120px"
                height="35px"
                borderRadius="16px"
                bgColor="#CACACA"
                onClick={onClose}
              >
                Cancel
              </Box>
              <Box
                as="button"
                maxW="150px"
                minW="120px"
                height="35px"
                borderRadius="16px"
                bgColor="#8E8E8E"
                textColor="FFFFFF"
                onClick={handleDelete}
                ref={cancelRef}
                ml={3}
              >
                Yes
              </Box>
            </Flex>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
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
            <DeletePopup></DeletePopup>
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
        columns={{ sm: 1, md: 2 }}
        padding={{ sm: "15px", md: "20px" }}
        bgColor="#FFFFFF"
      >
        {accountList.map((e: IAccount) => {
          return (
            <AccountCard
              account={e}
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
