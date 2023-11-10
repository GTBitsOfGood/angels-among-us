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
import { useState } from "react";

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
  const [loading, setLoading] = useState(false);
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
              ? "Are you sure you would like to uncover this post? This post would show up on the feed if uncovered, and volunteers would be able to resubmit foster offers."
              : "Are you sure you would like to mark this post as covered? This post would be hidden on the feed if covered, and volunteers would not be able to submit foster offers."}
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
              isLoading={loading}
              variant="solid-primary"
              width={32}
              borderRadius={16}
              onClick={async () => {
                setLoading(true);
                mutation
                  .mutateAsync(
                    { _id: postId },
                    {
                      onSuccess: () => {
                        utils.post.invalidate();
                      },
                      onError: () => {
                        toast({
                          title: "Error",
                          description:
                            "Changing covered status was unsuccessful",
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
                  )
                  .finally(() => {
                    onCoveredConfirmationClose();
                    setLoading(false);
                  });
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
