import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react";
import { trpc } from "../../utils/trpc";
import { Types } from "mongoose";

function DeletePostModal(props: {
  isDeleteConfirmationOpen: boolean;
  onDeleteConfirmationClose: () => void;
  onClose: () => void;
  postId: Types.ObjectId;
}) {
  const {
    isDeleteConfirmationOpen,
    onDeleteConfirmationClose,
    onClose,
    postId,
  } = props;

  const mutation = trpc.post.delete.useMutation();
  const utils = trpc.useContext();
  const toast = useToast();

  return (
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
  );
}

export default DeletePostModal;
