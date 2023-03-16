import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Button,
  Modal,
  Stack,
  ModalContent,
  ModalFooter,
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
        breed: Breed.Mix,
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

  return (
    <Modal onClose={onClose} isOpen={isOpen} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent minW={"850px"} maxH={"600px"} minH={"600px"}>
        <Stack
          paddingLeft={"75px"}
          paddingRight={"75px"}
          paddingTop={"40px"}
          paddingBottom={"40px"}
          overflowY="auto"
        >
          <Flex
            direction={"row"}
            alignItems={"center"}
            columnGap={2}
            onClick={isContentView ? onClose : () => setIsContentView(true)}
          >
            <ArrowBackIcon boxSize={"20px"}></ArrowBackIcon>
            {isContentView ? (
              <Text>Back to feed</Text>
            ) : (
              <Text>Back to New Pet content</Text>
            )}
          </Flex>
          <Text fontSize={"48px"} fontWeight={"bold"} lineHeight={"55px"}>
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
          <ModalFooter>
            {isContentView ? (
              <Button
                onClick={() => setIsContentView(false)}
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
                onClick={() => {
                  onClose();
                  createPost();
                }}
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
  );
};

export default PostCreationModal;
