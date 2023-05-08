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
  Button,
} from "@chakra-ui/react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { IAccount } from "../../utils/types/account";
import { HydratedDocument } from "mongoose";
import { trpc } from "../../utils/trpc";

interface PropertyType {
  accountList: HydratedDocument<IAccount>[];
  updateAccountList: Dispatch<SetStateAction<HydratedDocument<IAccount>[]>>;
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
    const newArr = accountList.filter(
      (e, i) => !itemsToDelete.includes(i)
    ) as HydratedDocument<IAccount>[];
    const removeArr = accountList.filter((e, i) => itemsToDelete.includes(i));
    const emails = removeArr.map((e) => e.email);
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
      <Button variant="outline-primary-inverted" onClick={onOpen}>
        Delete Selected Items
      </Button>
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
            <Text
              fontWeight={"semibold"}
              fontSize={"lg"}
              textAlign={"center"}
              textColor="#7D7E82"
            >
              Are you sure you want to delete the items selected?
            </Text>
            <Text fontWeight={"normal"} fontSize={"md"} textColor="#7D7E82">
              This cannot be undone.
            </Text>
            <Flex
              flexDirection="row"
              justifyContent="center"
              alignItems="center"
            >
              <Button
                maxW="150px"
                minW="120px"
                height="35px"
                borderRadius="12px"
                borderColor="#7D7E82"
                borderWidth={1}
                onClick={onClose}
                variant="outline"
                fontWeight="normal"
                textColor="#7D7E82"
              >
                Cancel
              </Button>
              <Box
                as="button"
                maxW="180px"
                minW="180px"
                height="35px"
                borderRadius="12px"
                bgColor="#57A0D5"
                textColor="white"
                onClick={handleDelete}
                ref={cancelRef}
                ml={3}
                _hover={{
                  bg: "#75B2DD",
                }}
              >
                Yes, delete items.
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
