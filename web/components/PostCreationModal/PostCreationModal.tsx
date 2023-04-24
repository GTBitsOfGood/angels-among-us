import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Button,
  Modal,
  Stack,
  ModalContent,
  ModalOverlay,
  Text,
  Flex,
  Box,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useReducer, useState } from "react";
import { z } from "zod";
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
  PetKind,
  Size,
  Status,
  Temperament,
  Trained,
} from "../../utils/types/post";
import FileUploadSlide from "./FileUpload/FileUploadSlide";
import { FormSlide } from "./Form/FormSlide";

function nullValidation<V>(val: V, ctx: z.RefinementCtx, field: string) {
  if (val === null) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `${field} required.`,
    });
    return z.NEVER;
  }
  return val;
}

function stringEmptyValidation(
  val: string,
  ctx: z.RefinementCtx,
  field: string
) {
  if (val.length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `${field} must not be empty.`,
    });
    return z.NEVER;
  }
  return val;
}

function arrayEmptyValidation<V>(
  val: V[],
  ctx: z.RefinementCtx,
  field: string
) {
  if (val.length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `${field} must have at least 1 value.`,
    });
    return z.NEVER;
  }
  return val;
}

const formSchema = z.object({
  name: z
    .string()
    .transform((val, ctx) => stringEmptyValidation(val, ctx, "Name")),
  description: z
    .string()
    .transform((val, ctx) => stringEmptyValidation(val, ctx, "Description")),
  petKind: z
    .nativeEnum(PetKind, { required_error: "Pet kind required." })
    .nullable()
    .transform((val, ctx) => nullValidation(val, ctx, "Pet kind")),
  gender: z
    .nativeEnum(Gender, { required_error: "Gender required." })
    .nullable()
    .transform((val, ctx) => nullValidation(val, ctx, "Gender")),
  age: z
    .nativeEnum(Age, { required_error: "Age required." })
    .nullable()
    .transform((val, ctx) => nullValidation(val, ctx, "Age")),
  type: z
    .nativeEnum(FosterType, {
      required_error: "Foster type required.",
    })
    .nullable()
    .transform((val, ctx) => nullValidation(val, ctx, "Foster type")),
  size: z
    .nativeEnum(Size, { required_error: "Size required." })
    .nullable()
    .transform((val, ctx) => nullValidation(val, ctx, "Size")),
  breed: z
    .array(z.nativeEnum(Breed))
    .transform((val, ctx) => arrayEmptyValidation(val, ctx, "Breed")),
  temperament: z.array(z.nativeEnum(Temperament)),
  medical: z.array(z.nativeEnum(Medical)),
  behavioral: z.array(z.nativeEnum(Behavioral)),
  houseTrained: z.nativeEnum(Trained),
  crateTrained: z.nativeEnum(Trained),
  spayNeuterStatus: z.nativeEnum(Trained),
  getsAlongWithMen: z.nativeEnum(Trained),
  getsAlongWithWomen: z.nativeEnum(Trained),
  getsAlongWithOlderKids: z.nativeEnum(Trained),
  getsAlongWithYoungKids: z.nativeEnum(Trained),
  getsAlongWithLargeDogs: z.nativeEnum(Trained),
  getsAlongWithSmallDogs: z.nativeEnum(Trained),
  getsAlongWithCats: z.nativeEnum(Trained),
});

export type FormState = z.input<typeof formSchema>;

export type Action<K extends keyof FormState, V extends FormState[K]> = {
  type: "setField";
  key: K;
  data: V;
};

const PostCreationModal: React.FC<{
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}> = ({ isOpen, onOpen, onClose }) => {
  const toast = useToast();
  const [isContentView, setIsContentView] = useState(true);
  const [numFiles, setNumFiles] = useState<number>(0);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [fileArr, setFileArr] = useState<Array<File>>([]);
  const [selectedFiles, setSelectedFiles] = useState<Array<File>>([]);

  function reducer<K extends keyof FormState, V extends FormState[K]>(
    state: FormState,
    action: Action<K, V>
  ) {
    switch (action.type) {
      case "setField":
        return {
          ...state,
          [action.key]: action.data,
        };
      default:
        throw Error("Unknown action.");
    }
  }

  const [formState, dispatch] = useReducer(reducer, {
    name: "",
    description: "",
    petKind: null,
    gender: null,
    age: null,
    type: null,
    size: null,
    breed: [],
    temperament: [],
    medical: [],
    behavioral: [],
    houseTrained: Trained.Unknown,
    crateTrained: Trained.Unknown,
    spayNeuterStatus: Trained.Unknown,
    getsAlongWithMen: Trained.Unknown,
    getsAlongWithWomen: Trained.Unknown,
    getsAlongWithOlderKids: Trained.Unknown,
    getsAlongWithYoungKids: Trained.Unknown,
    getsAlongWithLargeDogs: Trained.Unknown,
    getsAlongWithSmallDogs: Trained.Unknown,
    getsAlongWithCats: Trained.Unknown,
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

  const postCreate = trpc.post.create.useMutation();
  const postFinalize = trpc.post.finalize.useMutation();

  const createPost = async () => {
    const files: AttachmentInfo[] = await Promise.all(
      fileArr.map(async (file) => {
        const key = file.name;
        if (file.type.includes("image/")) {
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
        ...(formState as z.output<typeof formSchema>),
        attachments: files,
      });
      const oid = creationInfo._id;
      const uploadInfo = creationInfo.attachments;

      console.log(`creation: ${JSON.stringify(creationInfo)}`);

      for (let i = 0; i < fileArr.length; i++) {
        const file = fileArr[i];
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
          // paddingX="50px"
          minW={"790px"}
          minH={"760px"}
        >
          <Box paddingX="50px">
            <Button
              h={8}
              w="fit-content"
              leftIcon={<ArrowBackIcon />}
              bgColor="#C6E3F9"
              color="#57A0D5"
              borderRadius={9}
              _hover={{
                bgColor: "#C6E3F9",
              }}
              onClick={isContentView ? onClose : () => setIsContentView(true)}
              mb={4}
            >
              {isContentView ? "Back to feed" : "Back to New Post content"}
            </Button>
            <Text fontSize={"40px"} fontWeight={"bold"} lineHeight={"56px"}>
              Add A New Post
            </Text>
            <Box paddingBottom={5}>
              {isContentView ? (
                <Text>
                  Fill out the following fields to add a new pet to the Angels
                  Among Us Foster Feed!
                </Text>
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
            </Box>
          </Box>
          <Box overflowY="auto" paddingX="50px">
            {isContentView ? (
              <FormSlide dispatchFormState={dispatch} formState={formState} />
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
          </Box>
          <Flex
            paddingX="50px"
            direction={"row"}
            justifyContent={"flex-end"}
            paddingTop={"20px"}
          >
            <Button
              onClick={
                isContentView
                  ? () => {
                      const validation = formSchema.safeParse(formState);
                      if (validation.success) {
                        setIsContentView(false);
                      } else {
                        toast({
                          title: "Error",
                          description: validation.error.issues
                            .map((issue) => issue.message)
                            .join("\r\n"),
                          status: "error",
                          duration: 5000,
                          isClosable: true,
                          position: "top",
                          containerStyle: { whiteSpace: "pre" },
                        });
                      }
                    }
                  : () => {
                      //TODO: Wait for success to close.
                      onClose();
                      createPost();
                      setFileArr([]);
                      setIsContentView(true);
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
