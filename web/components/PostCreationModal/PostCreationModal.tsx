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
import { z } from "zod";
import {
  Age,
  Behavioral,
  Breed,
  formSchema,
  FormState,
  FosterType,
  Gender,
  GoodWith,
  Medical,
  PetKind,
  Size,
  Temperament,
  Trained,
} from "../../utils/types/post";
import FileUploadSlide from "./FileUpload/FileUploadSlide";
import { FormSlide } from "./Form/FormSlide";

function PostCreationModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isFormSlideView, setIsFormSlideView] = useState(true);
  const [numFiles, setNumFiles] = useState<number>(0);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [fileArr, setFileArr] = useState<Array<File>>([]);
  const [selectedFiles, setSelectedFiles] = useState<Array<File>>([]);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  //since the z are nullable, these will still pass if values are null.
  const [formState, setFormState] = useState<FormState>({
    name: "",
    description: "",
    petKind: null,
    gender: null,
    age: null,
    fosterType: null,
    size: null,
    breed: null,
    temperament: null,
    goodWith: [],
    medical: [],
    behavioral: [],
    houseTrained: null,
    crateTrained: null,
    spayNeuterStatus: null,
  });

  useEffect(() => {
    console.log("FILE ARRAY");
    console.log(fileArr);
    setNumFiles(fileArr.length);
  }, [fileArr]);

  useEffect(() => {
    console.log("SELECTED FILES");
    console.log(selectedFiles);
  }, [selectedFiles]);

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

  const handleNextButton = () => {
    console.log("next button click", formState);
    try {
      formSchema.safeParse(formState);
      console.log("formSchema", formSchema);
      console.log("safepasrse");
      setIsFormSlideView(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log("zood error");
        return;
      }
    }
  };

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
            <Flex
              direction={"row"}
              alignItems={"center"}
              columnGap={2}
              // onClick={isContentView ? onClose : () => setIsContentView(true)}
            >
              <ArrowBackIcon boxSize={"20px"}></ArrowBackIcon>
              <Text>
                {isFormSlideView ? "Back to feed" : "Back to New Pet content"}
              </Text>
            </Flex>
            <Text fontSize={"5xl"} fontWeight={"bold"} lineHeight={"56px"}>
              Add A New Pet
            </Text>
            {isFormSlideView ? (
              <Text>
                Fill out the following fields to add a new pet to the Angels
                Among Us Foster Feed!
              </Text>
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
            {isFormSlideView ? (
              <FormSlide
                setIsFormValid={setIsFormValid}
                setFormState={setFormState}
                formState={formState}
              />
            ) : (
              <FileUploadSlide
                fileArr={fileArr}
                selectedFiles={selectedFiles}
                setSelectedFiles={setSelectedFiles}
                setFileArr={setFileArr}
                numFiles={numFiles}
                showAlert={showAlert}
                setShowAlert={setShowAlert}
              ></FileUploadSlide>
            )}
            <ModalFooter>
              {isFormSlideView ? (
                <Button
                  // onClick={() => setIsFormSlideView(!isFormValid)}
                  onClick={handleNextButton}
                  color={postButtonStyle.color}
                  bgColor={postButtonStyle.bgColor}
                  borderRadius={postButtonStyle.borderRadius}
                  borderColor={postButtonStyle.borderColor}
                  width={"150px"}
                  height={"56px"}
                  border={"1px solid"}
                >
                  Next
                </Button>
              ) : (
                <Button
                  //TODO: On click, query database to create post.
                  onClick={onClose}
                  color={postButtonStyle.color}
                  bgColor={postButtonStyle.bgColor}
                  borderRadius={postButtonStyle.borderRadius}
                  borderColor={postButtonStyle.borderColor}
                  width={"150px"}
                  height={"56px"}
                  border={"1px solid"}
                >
                  <Text
                    lineHeight={"28px"}
                    fontWeight={"semibold"}
                    fontSize={"lg"}
                  >
                    Post
                  </Text>
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
