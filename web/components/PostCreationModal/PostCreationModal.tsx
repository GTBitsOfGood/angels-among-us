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
import { useEffect, useState } from "react";
import FileUploadSlide from "./FileUploadSlide";

function PostCreationModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isContentView, setIsContentView] = useState(true);

  const [numFiles, setNumFiles] = useState<number>(0);
  const [numVideos, setNumVideos] = useState<number>(0);
  const [fileArr, setFileArr] = useState<Array<File>>([]);
  const [selectedFiles, setSelectedFiles] = useState<Array<File>>([]);

  let postButtonStyle = {
    color: "#8C8C8C",
    bgColor: "#FFFFFF",
    borderColor: "#8C8C8C",
    borderRadius: "20px",
  };

  if (selectedFiles.length > 0) {
    postButtonStyle = {
      color: "#FFFFFF",
      bgColor: "#000000",
      borderColor: "000000",
      borderRadius: "20px",
    };
  }

  useEffect(() => {
    console.log("FILE ARR");
    console.log(fileArr);
    let tempArr = fileArr.filter((e) => e.type === "video/mp4");
    setNumVideos(tempArr.length);
    setNumFiles(fileArr.length);
  }, [fileArr]);

  useEffect(() => {
    console.log("NUM FILES AND VIDEOS");
    console.log(numFiles);
    console.log(numVideos);
  }, [numFiles, numVideos]);

  useEffect(() => {
    console.log("SELECTED FILES");
    console.log(selectedFiles);
  }, [selectedFiles]);

  return (
    <>
      <Button onClick={onOpen}>Post Creation Modal</Button>
      <Modal onClose={onClose} isOpen={isOpen} closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent minW={"850px"} minH={"790px"}>
          <Stack
            paddingLeft={"75px"}
            paddingRight={"75px"}
            paddingTop={"40px"}
            paddingBottom={"40px"}
          >
            {isContentView ? (
              <Flex direction={"row"} alignItems={"center"} onClick={onClose}>
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
                fileArr={fileArr}
                selectedFiles={selectedFiles}
                setSelectedFiles={setSelectedFiles}
                setFileArr={setFileArr}
                numFiles={numFiles}
                numVideos={numVideos}
              ></FileUploadSlide>
            )}
            <ModalFooter>
              {isContentView ? (
                <Button onClick={() => setIsContentView(false)}>Next</Button>
              ) : (
                <Button
                  onClick={onClose}
                  color={postButtonStyle.color}
                  bgColor={postButtonStyle.bgColor}
                  borderRadius={postButtonStyle.borderRadius}
                  borderColor={postButtonStyle.borderColor}
                  width={"150px"}
                  height={"56px"}
                  border={"1px solid"}
                >
                  Post
                </Button>
              )}
            </ModalFooter>
          </Stack>
        </ModalContent>
      </Modal>
    </>
  );
}

export default PostCreationModal;
