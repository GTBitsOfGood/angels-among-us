import {
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  Box,
  Flex,
  Text,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
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
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleDelete = () => {
    var newArr = accountList.filter(
      (e) => itemsToDelete.indexOf(accountList.indexOf(e)) < 0
    );
    var removeArr = accountList.filter(
      (e) => itemsToDelete.indexOf(accountList.indexOf(e)) > -1
    );
    var emails = removeArr.map((e) => e.email);
    mutation.mutate(emails, {
      onSuccess: () => {
        setShowError(false);
        updateAccountList(newArr);
        updateSelectItems(false);
        updateItemsToDelete([]);
      },
      onError: (error) => {
        setShowError(true);
        setErrorMessage(error.message);
      },
    });
  };

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
        <AlertDialogContent
          borderRadius="30px"
          padding={5}
          maxW={{ sm: "80%", md: "50%", lg: "500px" }}
        >
          <Flex
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            rowGap={"20px"}
          >
            <Text fontWeight={"semibold"} fontSize={"lg"} textAlign={"center"}>
              Are you sure you want to delete the items selected?
            </Text>
            <Text fontWeight={"normal"} fontSize={"md"}>
              This cannot be undone.
            </Text>
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
            {showError ? (
              <Alert status={"error"}>
                <AlertIcon></AlertIcon>
                {errorMessage}
              </Alert>
            ) : (
              <></>
            )}
          </Flex>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default DeletePopup;
