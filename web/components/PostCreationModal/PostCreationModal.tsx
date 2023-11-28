import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Button,
  Modal,
  ModalContent,
  ModalOverlay,
  Text,
  Flex,
  Box,
  useToast,
  ModalBody,
  ModalFooter,
  Heading,
  ModalHeader,
  Stack,
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
  Medical,
  Size,
  Temperament,
  Trained,
} from "../../utils/types/post";
import FileUploadSlide from "./FileUpload/FileUploadSlide";
import { FormSlide } from "./Form/FormSlide";
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

const PostCreationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const toast = useToast();
  const utils = trpc.useUtils();

  const [isContentView, setIsContentView] = useState(true);
  const [fileArr, setFileArr] = useState<Array<File>>([]);

  const defaultFormState = {
    name: "",
    description: "",
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

  const [loading, setLoading] = useState(false);
  const [formState, dispatch] = useReducer(reducer, defaultFormState);

  const postCreate = trpc.post.create.useMutation();
  const postFinalize = trpc.post.finalize.useMutation();

  const createPost = async () => {
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

      await postFinalize.mutateAsync({
        _id: new Types.ObjectId(oid),
      });
    } catch (e) {
      toast({
        title: "An error has occurred.",
        description:
          "We encountered an issue while processing your request. Please try again.",
        status: "error",
        position: "top",
        duration: 5000,
        isClosable: true,
      });
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

      if (uploadResp.status === 500 && ++count === maxTries) {
        throw new Error("Error uploading images.");
      }
    }
  };

  return (
    <Modal
      size={{ base: "full", md: "3xl" }}
      onClose={onClose}
      isOpen={isOpen}
      closeOnOverlayClick
      blockScrollOnMount
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent p={4} w="100%" h="100%">
        <ModalHeader>
          <Button
            h={8}
            w="fit-content"
            leftIcon={<ArrowBackIcon />}
            bgColor="tag-primary-bg"
            color="text-primary"
            borderRadius={9}
            _hover={{
              bgColor: "tag-primary-bg",
            }}
            onClick={isContentView ? onClose : () => setIsContentView(true)}
          >
            {isContentView ? "Back to feed" : "Back to post form"}
          </Button>
          <Heading size="lg" pt={2}>
            Add a new post
          </Heading>
        </ModalHeader>
        <ModalBody w="100%" h="100%">
          <Stack w="100%" h="100%">
            <Box paddingBottom={5}>
              {isContentView ? (
                <Text>
                  Fill out the following fields to add a new post to the foster
                  feed.
                </Text>
              ) : (
                <Flex direction={"row"} justifyContent={"space-between"}>
                  <Text fontSize={"l"} textStyle={"semibold"} color={"#000000"}>
                    Select up to 6 photos or video of the pet (one video limit)
                  </Text>
                  <Text fontSize={"l"} textStyle={"semibold"} color={"#8C8C8C"}>
                    {fileArr.length}/6
                  </Text>
                </Flex>
              )}
            </Box>
            <Box w="100%" h="100%">
              {isContentView ? (
                <FormSlide dispatchFormState={dispatch} formState={formState} />
              ) : (
                <FileUploadSlide fileArr={fileArr} setFileArr={setFileArr} />
              )}
            </Box>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button
            size="lg"
            isLoading={loading}
            _hover={loading ? {} : undefined}
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
                    setLoading(true);
                    //TODO: Wait for success to close.
                    createPost()
                      .then(() => {
                        utils.post.invalidate();
                        setFileArr([]);
                        setIsContentView(true);
                        dispatch({
                          type: "clear",
                        });
                        onClose();
                      })
                      .finally(() => {
                        setLoading(false);
                      });
                  }
            }
          >
            {isContentView ? "Next" : "Post"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PostCreationModal;
