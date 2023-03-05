import { Dispatch, SetStateAction, useCallback, useEffect } from "react";
import { Text, Flex } from "@chakra-ui/react";
import { FileRejection, useDropzone } from "react-dropzone";
import { ArrowUpIcon } from "@chakra-ui/icons";

interface PropsType {
  fileArr: Array<File>;
  setFileArr: Dispatch<SetStateAction<Array<File>>>;
  numFiles: number;
  numVideos: number;
}

function FileDropZone(props: PropsType) {
  const { fileArr, setFileArr, numFiles, numVideos } = props;

  //if num videos is 1 change accept criteria
  useEffect(() => {}, [numVideos]);

  //TODO fix previews for videos
  //Abstract out this function
  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      console.log("REJECTIONS");
      console.log(fileRejections);
      console.log("ACCEPTED");
      console.log(acceptedFiles);

      if (acceptedFiles.length > 0) {
        var tempFileArr = [...fileArr, ...acceptedFiles];
        setFileArr(tempFileArr);
        console.log("NEW FILE ARRAY");
        console.log(tempFileArr);
      }
    },
    []
  );

  const { getRootProps, getInputProps, acceptedFiles, fileRejections } =
    useDropzone({
      onDrop,
      maxFiles: 6 - numFiles,
      accept: {
        "image/*": [".jpg", ".png"],
        "video/*": [".mp4"],
      },
    });

  let dropZoneStyle = {
    width: "688px",
    height: "435px",
    border: "1px dashed #000000",
    borderRadius: "5.82474px",
  };

  if (numFiles > 0) {
    dropZoneStyle.width = "200px";
    dropZoneStyle.height = "215px";
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
            <Text fontSize={"2xl"} lineHeight={"28px"} fontWeight={"semibold"}>
              or drag and drop photos
            </Text>
          </Flex>
          <Text
            fontSize={"xl"}
            color={"rgba(0, 0, 0, 0.5)"}
            lineHeight={"21px"}
          >
            JPG and PNG images - MP4 video
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
