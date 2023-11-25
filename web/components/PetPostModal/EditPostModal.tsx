import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Button,
  Modal,
  ModalContent,
  ModalOverlay,
  Box,
  useToast,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Heading,
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
  Medical,
  SerializedPost,
  Size,
  Temperament,
  Trained,
} from "../../utils/types/post";
import FileUploadSlide from "../PostCreationModal/FileUpload/FileUploadSlide";
import { FormSlide } from "../PostCreationModal/Form/FormSlide";
import { Types } from "mongoose";
import { useRouter } from "next/router";

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

const EditPostModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  postData: SerializedPost;
  attachments: string[];
}> = ({ isOpen, onClose, postData, attachments }) => {
  const toast = useToast();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isContentView, setIsContentView] = useState(true);
  const [fileArr, setFileArr] = useState<Array<File>>([]);

  const {
    name,
    description,
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
  } = postData;

  const defaultFormState = {
    name,
    description,
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
  const reset = () => dispatch({ type: "clear" });

  useEffect(() => {
    reset();
  }, [postData]);

  useEffect(() => {
    const convertFiles = async () => {
      const videoTypes = new Set(["mp4", "mov"]);
      let fileObjects = [];
      for (const fileUrl of attachments) {
        try {
          const response = await fetch(fileUrl);
          const blob = await response.blob();

          // You can customize the file name and type as needed
          const isVideo = videoTypes.has(
            fileUrl.split(".").pop()!.toLowerCase()
          );
          let fileName = `image_${Date.now()}.jpg`;
          let fileType = "image/jpeg";
          if (isVideo) {
            fileName = `video_${Date.now()}.mp4`;
            fileType = "video/mp4";
          }

          const file = new File([blob], fileName, { type: fileType });
          fileObjects.push(file);
        } catch (error) {
          console.error(
            `Error converting ${fileUrl} to a File object: ${error}`
          );
        }
      }
      return fileObjects;
    };
    convertFiles().then((files) => setFileArr(files));
  }, [attachments]);

  const postUpdate = trpc.post.editPost.useMutation();
  const postFinalize = trpc.post.finalizeEdit.useMutation();

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
      const oid = new Types.ObjectId(postData._id);

      const updateInfo = await postUpdate.mutateAsync({
        _id: oid,
        updateFields: {
          ...(formState as z.output<typeof formSchema>),
          attachments: files,
        },
      });

      const newId = new Types.ObjectId(updateInfo._id);
      const uploadInfo = updateInfo.attachments;

      for (let i = 0; i < fileArr.length; i++) {
        const file = fileArr[i];
        await uploadFile(uploadInfo[`${updateInfo._id}/${file.name}`], file);
      }

      const newPost = await postFinalize.mutateAsync({
        oldId: oid,
        newId,
      });

      router.replace(`/post/${newPost._id.toString()}`);
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
            {isContentView ? "Back to post" : "Back to form content"}
          </Button>
          <Heading size="lg" pt={2}>
            Edit post
          </Heading>
        </ModalHeader>
        <ModalBody w="100%" h="100%">
          <Box w="100%" h="100%">
            {isContentView ? (
              <FormSlide dispatchFormState={dispatch} formState={formState} />
            ) : (
              <FileUploadSlide fileArr={fileArr} setFileArr={setFileArr} />
            )}
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button
            size="lg"
            variant={"outline-secondary"}
            mr={4}
            onClick={() => {
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button
            size="lg"
            isLoading={isLoading}
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
                    setIsLoading(true);
                    editPost()
                      .then(() => {
                        onClose();
                        setFileArr(fileArr);
                        setIsContentView(true);
                        dispatch({
                          type: "clear",
                        });
                      })
                      .finally(() => setIsLoading(false));
                  }
            }
          >
            {isContentView ? "Next" : "Save"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditPostModal;
