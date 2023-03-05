import { AddIcon, CloseIcon, MinusIcon } from "@chakra-ui/icons";
import { Image, Box, AspectRatio, Button } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";

interface PropsType {
  fileArr: Array<File>;
  setFileArr: Dispatch<SetStateAction<Array<File>>>;
  selectedFiles: Array<File>;
  setSelectedFiles: Dispatch<SetStateAction<Array<File>>>;
  idx: number;
}

function FilePreview(props: PropsType) {
  const { fileArr, setFileArr, selectedFiles, setSelectedFiles, idx } = props;

  let previewStyle = {
    border: "none",
  };

  let selectedStyle = {
    border: "2px solid #000000",
  };

  function updateSelections() {
    if (selectedFiles.indexOf(fileArr[idx]) > -1) {
      var temp = selectedFiles.filter((e) => e != fileArr[idx]);
      setSelectedFiles(temp);
    } else {
      var temp = [...selectedFiles];
      temp.push(fileArr[idx]);
      setSelectedFiles(temp);
    }
  }

  function removeFile() {
    setSelectedFiles(selectedFiles.filter((e) => e != fileArr[idx]));
    let temp = [...fileArr];
    setFileArr(temp.filter((e) => e != fileArr[idx]));
  }

  return (
    <Box position={"relative"}>
      {fileArr[idx].type === "video/mp4" ? (
        <Box
          width={"200px"}
          height={"215px"}
          borderRadius={"5.82474px"}
          bgColor={"#000000"}
          style={
            selectedFiles.indexOf(fileArr[idx]) > -1
              ? selectedStyle
              : previewStyle
          }
          onClick={updateSelections}
        >
          <AspectRatio maxW={"200px"} ratio={1}>
            <iframe src={URL.createObjectURL(fileArr[idx])} />
          </AspectRatio>
          <Box position={"absolute"} top={1} right={16}>
            <Button onClick={updateSelections} colorScheme={"blackAlpha"}>
              {selectedFiles.indexOf(fileArr[idx]) > -1 ? (
                <MinusIcon></MinusIcon>
              ) : (
                <AddIcon></AddIcon>
              )}
            </Button>
          </Box>
        </Box>
      ) : (
        <Image
          objectFit={"cover"}
          width={"200px"}
          height={"215px"}
          borderRadius={"5.82474px"}
          style={
            selectedFiles.indexOf(fileArr[idx]) > -1
              ? selectedStyle
              : previewStyle
          }
          onClick={updateSelections}
          src={URL.createObjectURL(fileArr[idx])}
          alt="Uploaded image"
        ></Image>
      )}

      <Box position={"absolute"} top={1} right={5}>
        <Button onClick={removeFile} colorScheme={"blackAlpha"}>
          <CloseIcon></CloseIcon>
        </Button>
      </Box>
    </Box>
  );
}

export default FilePreview;
