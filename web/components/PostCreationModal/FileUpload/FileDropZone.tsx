import { Dispatch, SetStateAction, useCallback } from "react";
import { Text, Flex } from "@chakra-ui/react";
import { FileRejection, useDropzone } from "react-dropzone";
import { ArrowUpIcon } from "@chakra-ui/icons";

interface PropsType {
  fileArr: Array<File>;
  setFileArr: Dispatch<SetStateAction<Array<File>>>;
  setShowAlert: Dispatch<SetStateAction<boolean>>;
}

function FileDropZone(props: PropsType) {
  const { fileArr, setFileArr, setShowAlert } = props;

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        setShowAlert(true);
      } else setShowAlert(false);

      let newFiles = acceptedFiles.filter((file) => {
        let idx = acceptedFiles.indexOf(file);
        if (
          file.type === "video/mp4" &&
          (fileArr.some((f) => f.type === "video/mp4") ||
            acceptedFiles.slice(0, idx).some((f) => f.type === "video/mp4"))
        ) {
          setShowAlert(true);
          return false;
        }
        return true;
      });
      setFileArr([...fileArr, ...newFiles]);
    },
    [fileArr, setFileArr, setShowAlert]
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
      <input {...getInputProps()} />
      {fileArr.length <= 0 ? (
        <Flex
          direction={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          rowGap={3}
        >
          <Flex direction={"row"} gap={1}>
            <Text
              fontSize={"2xl"}
              lineHeight={"28px"}
              color={"#0094FF"}
              fontWeight={"semibold"}
            >
              Click to upload photo
            </Text>
            <Text fontSize={"2xl"} lineHeight={"28px"} fontWeight={"regular"}>
              or drag and drop photos
            </Text>
          </Flex>
          <Text fontSize={"l"} color={"rgba(0, 0, 0, 0.5)"} lineHeight={"22px"}>
            JPG and PNG images - MP4 and MOV video
          </Text>
        </Flex>
      ) : (
        <Flex
          // p={10}
          direction={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          rowGap={3}
        >
          <ArrowUpIcon></ArrowUpIcon>
          <Text>Add photo</Text>
        </Flex>
      )}
    </Flex>
  );
}

export default FileDropZone;
