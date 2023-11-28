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

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
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

      setFileArr([...fileArr, ...acceptedFiles]);
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
