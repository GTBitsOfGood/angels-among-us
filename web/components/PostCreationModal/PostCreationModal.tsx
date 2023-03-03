import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Button,
  Modal,
  Stack,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  useDisclosure,
  Text,
  Flex,
} from "@chakra-ui/react";
import { useState } from "react";
import FileUploadSlide from "./FileUploadSlide";

function PostCreationModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isContentView, setIsContentView] = useState(true);

  const [numFiles, setNumFiles] = useState<number>(0);
  const [numVideos, setNumVideos] = useState<number>(0);
  //TODO what is this type
  const [filePreviewArr, setFilePreviewArr] = useState<Array<File>>([]);
  const [fileArr, setFileArr] = useState<Array<File>>([]);
  const [isFirstUpload, setIsFirstUpload] = useState<boolean>(true);

  return (
    <>
      <Button onClick={onOpen}>Post Creation Modal</Button>
      <Modal onClose={onClose} isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent minW={"850px"} minH={"790px"}>
          <Stack
            paddingLeft={"75px"}
            paddingRight={"75px"}
            paddingTop={"40px"}
            paddingBottom={"40px"}
          >
            {isContentView ? (
              <Flex
                direction={"row"}
                alignItems={"center"}
                onClick={() => setIsContentView(true)}
              >
                <ArrowBackIcon></ArrowBackIcon>
                <Text>Back to feed</Text>
              </Flex>
            ) : (
              <Flex
                direction={"row"}
                alignItems={"center"}
                onClick={() => setIsContentView(true)}
              >
                <ArrowBackIcon></ArrowBackIcon>
                <Text>Back to New Pet content</Text>
              </Flex>
            )}

            <Text fontSize={"5xl"} fontWeight={"bold"} lineHeight={"56px"}>
              Add A New Pet
            </Text>
            {isContentView ? (
              <></>
            ) : (
              <Flex direction={"row"} justifyContent={"space-between"}>
                <Text size={"xl"} textStyle={"semibold"} color={"#000000"}>
                  Select up to 6 photos or video of the pet (one video limit)
                </Text>
                <Text size={"xl"} textStyle={"semibold"} color={"#8C8C8C"}>
                  {numFiles}/6
                </Text>
              </Flex>
            )}
            {isContentView ? (
              <>insert new pet content component here</>
            ) : (
              <FileUploadSlide
                isFirstUpload={isFirstUpload}
                setIsFirstUpload={setIsFirstUpload}
                filePreviewArr={filePreviewArr}
                setFilePreviewArr={setFilePreviewArr}
                fileArr={fileArr}
                setFileArr={setFileArr}
                numFiles={numFiles}
                setNumFiles={setNumFiles}
                numVideos={numVideos}
                setNumVideos={setNumVideos}
              ></FileUploadSlide>
            )}
            <ModalFooter>
              {isContentView ? (
                <Button onClick={() => setIsContentView(false)}>Next</Button>
              ) : (
                <Button onClick={onClose}>Post</Button>
              )}
            </ModalFooter>
          </Stack>
        </ModalContent>
      </Modal>
    </>
  );
}

export default PostCreationModal;
