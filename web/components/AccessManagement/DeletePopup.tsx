import {
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  Button,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useToast,
} from "@chakra-ui/react";
import { Dispatch, MutableRefObject, SetStateAction, useRef } from "react";
import { trpc } from "../../utils/trpc";

interface PropertyType {
  selectedAccounts: MutableRefObject<Set<string>>;
  setIsSelecting: Dispatch<SetStateAction<boolean>>;
}

function DeletePopup(props: PropertyType) {
  const { selectedAccounts, setIsSelecting } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);
  const utils = trpc.useUtils();
  const mutation = trpc.account.remove.useMutation();
  const toast = useToast();

  const handleDelete = () => {
    const emails = Array.from(selectedAccounts.current);
    mutation.mutate(emails, {
      onSuccess: () => {
        utils.account.invalidate();
        setIsSelecting(false);
        selectedAccounts.current.clear();
        onClose();
        toast({
          title: "Success",
          description: "Accounts successfully deleted.",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      },
      onError: () => {
        onClose();
        toast({
          title: "Error",
          description:
            "We encountered a problem deleting the selected accounts. Please try again later.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      },
    });
  };

  return (
    <>
      <Button
        size="sm"
        variant="outline-primary-inverted"
        bgColor="white"
        color="text-primary"
        borderWidth={2}
        _hover={{
          color: "white",
          bgColor: "btn-solid-primary-bg",
          border: "2px solid white",
        }}
        onClick={() => selectedAccounts.current.size > 0 && onOpen()}
      >
        Delete Selected Accounts
      </Button>
      <AlertDialog
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader
            fontSize="lg"
            fontWeight="bold"
            letterSpacing="wide"
          >
            Delete selected accounts
          </AlertDialogHeader>
          <AlertDialogBody>
            Are you sure you want to delete the accounts selected? This cannot
            be undone.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              ref={cancelRef}
              variant="outline-secondary"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button colorScheme="red" ml={3} onClick={handleDelete}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default DeletePopup;
