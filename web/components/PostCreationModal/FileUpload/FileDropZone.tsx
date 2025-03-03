import { Dispatch, SetStateAction, useCallback } from "react";
import {
  Text,
  Flex,
  useToast,
  useBreakpointValue,
  Icon,
} from "@chakra-ui/react";
import { FileRejection, useDropzone } from "react-dropzone";
import { GrUpload } from "react-icons/gr";

interface PropsType {
  fileArr: Array<File>;
  setFileArr: Dispatch<SetStateAction<Array<File>>>;
}

const MinimalDropZone = () => {
  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      rowGap={3}
    >
      <Icon as={GrUpload} />
      <Text>Upload attachment</Text>
    </Flex>
  );
};

const FullDropZone = () => {
  return (
    <Flex
      direction={"column"}
      alignItems={"center"}
      justifyContent={"center"}
      rowGap={3}
    >
      <Flex direction={"row"} gap={1}>
        <Text
          as="span"
          fontSize={"2xl"}
          lineHeight={"28px"}
          color={"#0094FF"}
          fontWeight={"semibold"}
        >
          Click to upload photo
        </Text>
        <Text
          as="span"
          fontSize={"2xl"}
          lineHeight={"28px"}
          fontWeight={"regular"}
        >
          or drag and drop photos
        </Text>
      </Flex>
      <Text fontSize={"l"} color={"rgba(0, 0, 0, 0.5)"} lineHeight={"22px"}>
        JPG and PNG images - MP4 and MOV video
      </Text>
    </Flex>
  );
};

function FileDropZone(props: PropsType) {
  const { fileArr, setFileArr } = props;
  const toast = useToast();

  const DropZoneComponent = useBreakpointValue({
    base: <MinimalDropZone />,
    lg: <FullDropZone />,
  });

  const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
  const MAX_IMAGE_SIZE = 3 * 1024 * 1024; // 3MB

  async function resizeImage(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) return reject(new Error("Canvas context not available"));

          const MAX_WIDTH = 4096;
          const MAX_HEIGHT = 4096;
          let width = img.width;
          let height = img.height;

          if (width > MAX_WIDTH || height > MAX_HEIGHT) {
            if (width > height) {
              height = (height * MAX_WIDTH) / width;
              width = MAX_WIDTH;
            } else {
              width = (width * MAX_HEIGHT) / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(new File([blob], file.name, { type: "image/jpeg" }));
              } else {
                reject(new Error("Failed to resize image"));
              }
            },
            "image/jpeg",
            0.8
          );
        };
      };
      reader.onerror = (error) => reject(error);
    });
  }

  const onDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        toast({
          status: "error",
          position: "top",
          title: "Error",
          description: fileRejections[0].errors[0].message,
          duration: 4000,
          isClosable: true,
        });
        return;
      }

      const currentNumVideos = fileArr.filter(
        (file) => file.type === "video/mp4" || file.type === "video/quicktime"
      ).length;
      const incomingNumVideos = acceptedFiles.filter(
        (file) => file.type === "video/mp4" || file.type === "video/quicktime"
      ).length;

      if (currentNumVideos + incomingNumVideos > 1) {
        toast({
          status: "error",
          position: "top",
          title: "Error",
          description: "Maximum of 1 video permitted.",
          duration: 4000,
          isClosable: true,
        });
        return;
      }

      let newFiles: File[] = [];

      const processedFiles = await Promise.all(
        acceptedFiles.map(async (file) => {
          console.log(file.size);
          if (file.type.startsWith("video/")) {
            if (file.size > MAX_VIDEO_SIZE) {
              toast({
                status: "error",
                position: "top",
                title: "Error",
                description: `The video ${file.name} exceeds the 50MB limit.`,
                duration: 4000,
                isClosable: true,
              });
              return null;
            }
            return file;
          } else if (file.type.startsWith("image/")) {
            if (file.size > MAX_IMAGE_SIZE) {
              try {
                return await resizeImage(file);
              } catch (error) {
                console.error(`Failed to resize image ${file.name}`, error);
                toast({
                  status: "error",
                  position: "top",
                  title: "Error",
                  description: `Failed to resize image ${file.name}.`,
                  duration: 4000,
                  isClosable: true,
                });
                return null;
              }
            }
            return file;
          }
          return null;
        })
      );

      newFiles = processedFiles.filter((file): file is File => file !== null);
      setFileArr([...fileArr, ...newFiles]);
    },
    [fileArr, setFileArr]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 6 - fileArr.length,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "video/mp4": [".mp4"],
      "video/quicktime": [".mov"],
    },
  });

  return (
    <Flex
      flex={1}
      minW="100%"
      minH="100%"
      border="1px dashed gray"
      borderRadius={8}
      direction={"column"}
      alignItems={"center"}
      justifyContent={"center"}
      {...getRootProps()}
      _hover={{
        cursor: "pointer",
      }}
    >
      <>
        <input {...getInputProps()} />
        {fileArr.length <= 0 ? DropZoneComponent : <MinimalDropZone />}
      </>
    </Flex>
  );
}

export default FileDropZone;
