import { Dispatch, SetStateAction, useCallback } from "react";
import { Text, Flex } from "@chakra-ui/react";
import { FileRejection, useDropzone } from "react-dropzone";
import { ArrowUpIcon } from "@chakra-ui/icons";

interface PropsType {
  fileArr: Array<File>;
  setFileArr: Dispatch<SetStateAction<Array<File>>>;
  numFiles: number;
  setShowAlert: Dispatch<SetStateAction<boolean>>;
}

function FileDropZone(props: PropsType) {
  const { fileArr, setFileArr, numFiles, setShowAlert } = props;

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      console.log("REJECTIONS");
      console.log(fileRejections);
      console.log("ACCEPTED");
      console.log(acceptedFiles);

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
    maxFiles: 6 - numFiles,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png"],
      "video/*": [".mp4", ".mov"],
    },
  });

  let dropZoneStyle = {
    width: "688px",
    height: "435px",
    border: "1px dashed #000000",
    borderRadius: "5.82474px",
  };

  if (numFiles > 0) {
    dropZoneStyle.width = "211px";
    dropZoneStyle.height = "211px";
  }

  return (
    <Flex
      width={dropZoneStyle.width}
      height={dropZoneStyle.height}
      border={dropZoneStyle.border}
      borderRadius={dropZoneStyle.borderRadius}
      direction={"column"}
      alignItems={"center"}
      justifyContent={"center"}
      {...getRootProps()}
      _hover={{
        cursor: "pointer",
      }}
    >
      <input {...getInputProps()} />
      {numFiles <= 0 ? (
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
