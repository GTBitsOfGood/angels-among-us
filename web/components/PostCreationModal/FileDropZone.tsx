import { Dispatch, SetStateAction, useCallback, useEffect } from "react";
import { Text, Flex } from "@chakra-ui/react";
import { FileRejection, useDropzone } from "react-dropzone";
import { ArrowUpIcon } from "@chakra-ui/icons";

//TODO what types for previews
interface PropsType {
  filePreviewArr: Object[];
  setFilePreviewArr: Function;
  isFirstUpload: boolean;
  setIsFirstUpload: Dispatch<SetStateAction<boolean>>;
  fileArr: File[];
  setFileArr: Dispatch<SetStateAction<File[]>>;
  numFiles: number;
  setNumFiles: Dispatch<SetStateAction<number>>;
  numVideos: number;
  setNumVideos: Dispatch<SetStateAction<number>>;
}

function FileDropZone(props: PropsType) {
  const {
    filePreviewArr,
    setFilePreviewArr,
    isFirstUpload,
    setIsFirstUpload,
    fileArr,
    setFileArr,
    numFiles,
    setNumFiles,
    numVideos,
    setNumVideos,
  } = props;

  //if num videos is 1 change accept criteria
  useEffect(() => {}, [numVideos]);

  //TODO fix previews for videos
  //Abstract out this function
  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      var tempFileArr = [...fileArr];
      var newFileArr = tempFileArr.concat(acceptedFiles);
      setFileArr(newFileArr);
      console.log("NEW FILE ARRAY");
      console.log(newFileArr);

      //Update previews
      if (acceptedFiles.length > 0) {
        var tempFilePreviewArr = [...filePreviewArr];
        var newFilePreviewArr = acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
        setFilePreviewArr(tempFilePreviewArr.concat(newFilePreviewArr));

        setIsFirstUpload(false);
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

  if (!isFirstUpload) {
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
      {isFirstUpload ? (
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
