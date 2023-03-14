import {
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  Box,
  Flex,
  Text,
} from "@chakra-ui/react";
import { Dispatch, SetStateAction, useRef } from "react";
import { IAccount } from "../../utils/types/account";
import { trpc } from "../../utils/trpc";

interface PropertyType {
  accountList: IAccount[];
  updateAccountList: Dispatch<SetStateAction<IAccount[]>>;
  itemsToDelete: Number[];
  updateItemsToDelete: Dispatch<SetStateAction<Number[]>>;
  updateSelectItems: Dispatch<SetStateAction<boolean>>;
}

function DeletePopup(props: PropertyType) {
  const {
    accountList,
    updateAccountList,
    itemsToDelete,
    updateItemsToDelete,
    updateSelectItems,
  } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);

  const mutation = trpc.account.remove.useMutation();

  function handleDelete() {
    var temp = accountList.filter(
      (e) => itemsToDelete.indexOf(accountList.indexOf(e)) < 0
    );
    console.log(temp);
    var emails = temp.map((e) => e.email);
    console.log(emails);
    mutation.mutate(emails);
    console.log(mutation);
    if (!mutation.error) {
      updateAccountList(temp);
      updateSelectItems(false);
      updateItemsToDelete([]);
    }
  }

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
        <Text fontSize="16" fontWeight="400" lineHeight="19px">
          Delete Selected Items
        </Text>
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
          <Flex flexDirection="row" justifyContent="center" alignItems="center">
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

export default DeletePopup;
