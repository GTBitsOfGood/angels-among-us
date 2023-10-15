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
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { useReducer, useState } from "react";
import { z } from "zod";
import { trpc } from "../../utils/trpc";
import {
  Age,
  AttachmentInfo,
  Behavioral,
  Breed,
  FosterType,
  Gender,
  IPost,
  Medical,
  PetKind,
  Size,
  Temperament,
  Trained,
} from "../../utils/types/post";
import FileUploadSlide from "../PostCreationModal/FileUpload/FileUploadSlide";
import { FormSlide } from "../PostCreationModal/Form/FormSlide";
import { Types } from "mongoose";

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
  type: "setField" | "clear";
  key?: K;
  data?: V;
};

const EditPostModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  postData: IPost & { _id: Types.ObjectId };
}> = ({ isOpen, onClose, postData }) => {
  const toast = useToast();
  const utils = trpc.useContext();

  const [isContentView, setIsContentView] = useState(true);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [fileArr, setFileArr] = useState<Array<File>>([]);
  const [selectedFiles, setSelectedFiles] = useState<Array<File>>([]);

  const {
    name,
    description,
    petKind,
    type,
    size,
    age,
    spayNeuterStatus,
    houseTrained,
    crateTrained,
    temperament,
    behavioral,
    medical,
    gender,
    breed,
    getsAlongWithOlderKids,
    getsAlongWithYoungKids,
    getsAlongWithLargeDogs,
    getsAlongWithSmallDogs,
    getsAlongWithWomen,
    getsAlongWithMen,
    getsAlongWithCats,
    attachments,
  } = postData;

  const defaultFormState = {
    name,
    description,
    petKind,
    gender,
    age,
    type,
    size,
    breed,
    temperament,
    spayNeuterStatus,
    houseTrained,
    crateTrained,
    behavioral,
    medical,
    getsAlongWithOlderKids,
    getsAlongWithYoungKids,
    getsAlongWithLargeDogs,
    getsAlongWithSmallDogs,
    getsAlongWithWomen,
    getsAlongWithMen,
    getsAlongWithCats,
  };

  function reducer<K extends keyof FormState, V extends FormState[K]>(
    state: FormState,
    action: Action<K, V>
  ) {
    switch (action.type) {
      case "setField":
        return {
          ...state,
          [action.key!]: action.data,
        };
      case "clear":
        return defaultFormState;
      default:
        throw Error("Unknown action.");
    }
  }

  const [formState, dispatch] = useReducer(reducer, defaultFormState);

  const postCreate = trpc.post.create.useMutation();
  const postFinalize = trpc.post.finalize.useMutation();

  const editPost = async () => {
    const files: AttachmentInfo[] = await Promise.all(
      fileArr.map(async (file) => {
        const key = file.name;
        if (file.type.includes("image/")) {
          const url = URL.createObjectURL(file);
          return new Promise((resolve) => {
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
    try {
      const creationInfo = await postCreate.mutateAsync({
        ...(formState as z.output<typeof formSchema>),
        attachments: files,
      });
      const oid = creationInfo._id;
      const uploadInfo = creationInfo.attachments;

      for (let i = 0; i < fileArr.length; i++) {
        const file = fileArr[i];
        await uploadFile(uploadInfo[`${oid}/${file.name}`], file);
      }

      const postInfo = await postFinalize.mutateAsync({
        _id: oid,
      });

      console.log(JSON.stringify(postInfo));
    } catch (e) {
      //TODO: Delete pending post on error
      throw e;
    }
  };

  const uploadFile = async (url: string, file: File) => {
    let count = 0;
    const maxTries = 3;
    while (true) {
      const uploadResp = await fetch(url, {
        method: "PUT",
        headers: {
          "content-length": `${file.size}`,
        },
        body: await file.arrayBuffer(),
      });

      if (uploadResp.status === 200) {
        return;
      }

      if (uploadResp.status === 500 && count++ === maxTries) {
        throw new Error("Error uploading images.");
      }
    }
  };

  return (
    <Modal
      onClose={onClose}
      isOpen={isOpen}
      closeOnOverlayClick={false}
      blockScrollOnMount
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent p={4} minW="800px" minH="750px">
        <ModalBody>
          <Stack>
            <Box>
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
                Back to Post
              </Button>
              <Text fontSize={"40px"} fontWeight={"bold"} lineHeight={"56px"}>
                Edit Post
              </Text>
            </Box>
            <Box>
              {isContentView ? (
                <FormSlide dispatchFormState={dispatch} formState={formState} />
              ) : (
                <FileUploadSlide
                  fileArr={fileArr}
                  selectedFiles={selectedFiles}
                  setSelectedFiles={setSelectedFiles}
                  setFileArr={setFileArr}
                  showAlert={showAlert}
                  setShowAlert={setShowAlert}
                ></FileUploadSlide>
              )}
            </Box>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button
            variant={fileArr.length > 0 ? "solid-primary" : "outline-primary"}
            onClick={
              isContentView
                ? () => {
                    const validation = formSchema.safeParse(formState);
                    if (validation.success) {
                      setIsContentView(false);
                    } else {
                      toast.closeAll();
                      toast({
                        title: "Error",
                        description: validation.error.issues
                          .map((issue) => issue.message)
                          .join("\r\n"),
                        containerStyle: {
                          whiteSpace: "pre-line",
                        },
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                        position: "top",
                      });
                    }
                  }
                : () => {
                    //TODO: Wait for success to close.
                    editPost().then(() => {
                      onClose();
                      utils.post.invalidate();
                      setFileArr([]);
                      setIsContentView(true);
                      dispatch({
                        type: "clear",
                      });
                    });
                  }
            }
            width={"125px"}
            height={"50px"}
          >
            <Text lineHeight={"28px"} fontWeight={"regular"} fontSize={"xl"}>
              {isContentView ? "Next" : "Post"}
            </Text>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditPostModal;
