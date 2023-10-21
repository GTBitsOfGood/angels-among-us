import {
  Button,
  Flex,
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

function MarkCoveredModal(props: {
  isCoveredConfirmationOpen: boolean;
  onCoveredConfirmationClose: () => void;
  postId: Types.ObjectId;
  isCovered: boolean;
}) {
  const {
    isCoveredConfirmationOpen,
    onCoveredConfirmationClose,
    postId,
    isCovered,
  } = props;
  const mutation = trpc.post.updateStatus.useMutation();
  const utils = trpc.useContext();
  const toast = useToast();

  return (
    <Flex>
      <Modal
        isOpen={isCoveredConfirmationOpen}
        onClose={onCoveredConfirmationClose}
      >
        <ModalOverlay />
        <ModalContent textAlign="center" width={["85%"]}>
          <ModalHeader marginTop={2}>
            {isCovered ? "Uncover Post" : "Mark As Covered"}
          </ModalHeader>
          <ModalBody>
            {isCovered
              ? "Are you sure you would like to uncover this post? This post would show up on the feed if uncovered."
              : "Are you sure you would like to mark this post as covered? This post would be hidden on the feed if covered."}
          </ModalBody>
          <ModalFooter justifyContent="center" marginBottom={2}>
            <Button
              variant="outline-secondary"
              width={32}
              borderRadius={16}
              marginRight={10}
              onClick={onCoveredConfirmationClose}
            >
              Cancel
            </Button>
            <Button
              variant="solid-primary"
              width={32}
              borderRadius={16}
              onClick={() => {
                mutation.mutate(
                  { _id: postId },
                  {
                    onSuccess: () => {
                      utils.post.invalidate();
                    },
                    onError: () => {
                      toast({
                        title: "Error",
                        description: "Changing covered status was unsuccessful",
                        containerStyle: {
                          whiteSpace: "pre-line",
                        },
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                        position: "top",
                      });
                    },
                  }
                );
                onCoveredConfirmationClose();
              }}
            >
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default MarkCoveredModal;
