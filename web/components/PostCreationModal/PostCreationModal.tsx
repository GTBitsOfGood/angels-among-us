import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Button,
  Modal,
  Stack,
  ModalContent,
  ModalOverlay,
  Text,
  Flex,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { trpc } from "../../utils/trpc";
import {
  Age,
  AttachmentInfo,
  Behavioral,
  Breed,
  FosterType,
  Gender,
  GoodWith,
  Medical,
  Size,
  Status,
  Temperament,
  Trained,
} from "../../utils/types/post";
import FileUploadSlide from "./FileUploadSlide";

const PostCreationModal: React.FC<{
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}> = ({ isOpen, onOpen, onClose }) => {
  const [isContentView, setIsContentView] = useState(true);
  const [numFiles, setNumFiles] = useState<number>(0);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [fileArr, setFileArr] = useState<Array<File>>([]);
  const [selectedFiles, setSelectedFiles] = useState<Array<File>>([]);

  useEffect(() => {
    console.log("FILE ARRAY");
    console.log(fileArr);
    setNumFiles(fileArr.length);
  }, [fileArr]);

  useEffect(() => {
    console.log("SELECTED FILES");
    console.log(selectedFiles);
  }, [selectedFiles]);

  const postCreate = trpc.post.create.useMutation();
  const postFinalize = trpc.post.finalize.useMutation();

  const createPost = async () => {
    const files: AttachmentInfo[] = await Promise.all(
      selectedFiles.map(async (file) => {
        const key = file.name;
        if (file.type.includes("img/")) {
          const url = URL.createObjectURL(file);
          return new Promise((resolve, _) => {
            const image = new Image();
            image.onload = () => {
              URL.revokeObjectURL(url);
              resolve({
                type: "image",
                key,
                length: image.height,
                width: image.width,
              });
            };
            image.src = url;
          });
        } else {
          return {
            type: "video",
            key,
          };
        }
      })
    );
    console.log(`${JSON.stringify(files)}`);
    try {
      const creationInfo = await postCreate.mutateAsync({
        type: FosterType.Shelter,
        size: Size.S,
        breed: [Breed.Mix],
        gender: Gender.Male,
        age: Age.Puppy,
        temperament: Temperament.Calm,
        goodWith: [GoodWith.Men],
        medical: [Medical.Parvo],
        behavioral: [Behavioral.Barking],
        houseTrained: Trained.Yes,
        crateTrained: Trained.Yes,
        spayNeuterStatus: Status.Yes,
        attachments: files,
      });
      const oid = creationInfo._id;
      const uploadInfo = creationInfo.attachments;

      console.log(`creation: ${JSON.stringify(creationInfo)}`);

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        await uploadFile(uploadInfo[`${oid}/${file.name}`], file);
      }

      const postInfo = await postFinalize.mutateAsync({
        _id: oid,
      });

      console.log(JSON.stringify(postInfo));
    } catch (e) {
      console.log(e);
    }
  };

  const uploadFile = async (url: string, file: File) => {
    const uploadResp = await fetch(url, {
      method: "PUT",
      headers: {
        "content-length": `${file.size}`,
      },
      body: await file.arrayBuffer(),
    });
    if (uploadResp.status == 500) {
      // TODO retry logic
    }
  };

  let postButtonStyle = {
    color: "#57A0D5",
    bgColor: "#FFFFFF",
    borderColor: "#57A0D5",
    borderRadius: "20px",
  };

  if (selectedFiles.length > 0) {
    postButtonStyle = {
      color: "#FFFFFF",
      bgColor: "#57A0D5",
      borderColor: "#57A0D5",
      borderRadius: "20px",
    };
  }

  return (
    <Modal onClose={onClose} isOpen={isOpen} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent
        minW={"800px"}
        maxH={"770px"}
        minH={"770px"}
        alignItems={"center"}
      >
        <Stack
          paddingTop={"30px"}
          paddingBottom={"20px"}
          paddingRight={"50px"}
          paddingLeft={"50px"}
          minW={"790px"}
          minH={"760px"}
        >
          <Flex
            onClick={isContentView ? onClose : () => setIsContentView(true)}
            _hover={{
              cursor: "pointer",
            }}
            direction={"row"}
            alignItems={"center"}
            justifyContent={"flex-start"}
            height={"28px"}
            maxW={isContentView ? "140px" : "220px"}
            paddingLeft={"5px"}
            borderRadius={"9px"}
            color={"#57A0D5"}
            columnGap={"5px"}
            bgColor={"#C6E3F9"}
            marginBottom={"20px"}
          >
            <ArrowBackIcon boxSize={"23px"}></ArrowBackIcon>
            {isContentView ? (
              <Text fontSize={"l"} textStyle={"semibold"}>
                Back to feed
              </Text>
            ) : (
              <Text fontSize={"l"} textStyle={"semibold"}>
                Back to New Pet content
              </Text>
            )}
          </Flex>
          <Text fontSize={"40px"} fontWeight={"bold"} lineHeight={"56px"}>
            Add A New Pet
          </Text>
          {isContentView ? (
            <></>
          ) : (
            <Flex
              direction={"row"}
              justifyContent={"space-between"}
              maxW={"688px"}
              paddingBottom={"20px"}
            >
              <Text fontSize={"l"} textStyle={"semibold"} color={"#000000"}>
                Select up to 6 photos or video of the pet (one video limit)
              </Text>
              <Text fontSize={"l"} textStyle={"semibold"} color={"#8C8C8C"}>
                {numFiles}/6
              </Text>
            </Flex>
          )}
          <Stack overflowY="auto">
            {isContentView ? (
              //TODO: Add new pet content slide component here.
              <></>
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
          </Stack>
          <Flex
            width={"688px"}
            direction={"row"}
            justifyContent={"flex-end"}
            paddingTop={"20px"}
          >
            <Button
              onClick={
                isContentView
                  ? () => setIsContentView(false)
                  : () => {
                      onClose();
                      createPost();
                    }
              }
              color={postButtonStyle.color}
              bgColor={postButtonStyle.bgColor}
              borderRadius={postButtonStyle.borderRadius}
              borderColor={postButtonStyle.borderColor}
              width={"125px"}
              height={"50px"}
              border={"1px solid"}
            >
              <Text lineHeight={"28px"} fontWeight={"regular"} fontSize={"xl"}>
                {isContentView ? "Next" : "Post"}
              </Text>
            </Button>
          </Flex>
        </Stack>
      </ModalContent>
    </Modal>
  );
};

export default PostCreationModal;
