import { DeleteIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { trpc } from "../../utils/trpc";
import { Types } from "mongoose";

function DeleteButtonModal(props: {
  onClose: () => void;
  postId: Types.ObjectId;
}) {
  const { onClose, postId } = props;

  const mutation = trpc.post.delete.useMutation();
  const utils = trpc.useContext();
  const toast = useToast();

  const {
    isOpen: isDeleteConfirmationOpen,
    onOpen: onDeleteConfirmationOpen,
    onClose: onDeleteConfirmationClose,
  } = useDisclosure();

  return (
    <Flex>
      <Button
        h={8}
        backgroundColor="white"
        onClick={onDeleteConfirmationOpen}
        _hover={{}}
        leftIcon={<DeleteIcon marginRight="5px" color="text-secondary" />}
      >
        <Text textDecoration="underline" color="text-secondary">
          Delete
        </Text>
      </Button>
      <Modal
        isOpen={isDeleteConfirmationOpen}
        onClose={onDeleteConfirmationClose}
      >
        <ModalOverlay />
        <ModalContent textAlign="center" width={["85%"]}>
          <ModalHeader marginTop={2}>Delete Post</ModalHeader>
          <ModalBody>
            Are you sure you would like to delete this post? <br /> You cannot
            undo this action afterwards.
          </ModalBody>
          <ModalFooter justifyContent="center" marginBottom={2}>
            <Button
              variant="outline-secondary"
              width={32}
              borderRadius={16}
              marginRight={10}
              onClick={onDeleteConfirmationClose}
            >
              Cancel
            </Button>
            <Button
              variant="solid-primary"
              width={32}
              borderRadius={16}
              onClick={() => {
                mutation.mutate(
                  { postOid: postId },
                  {
                    onSuccess: () => {
                      utils.post.invalidate();
                      onClose();
                    },
                    onError: () => {
                      toast({
                        title: "Error",
                        description: "Post deletion was unsuccessful",
                        containerStyle: {
                          whiteSpace: "pre-line",
                        },
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                        position: "top",
                      });
                      onDeleteConfirmationClose();
                    },
                  }
                );
              }}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default DeleteButtonModal;
