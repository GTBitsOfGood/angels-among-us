import { Image, Box, CloseButton } from "@chakra-ui/react";
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
    console.log("remove");
    setSelectedFiles(selectedFiles.filter((e) => e != fileArr[idx]));
    let temp = [...fileArr];
    setFileArr(temp.filter((e) => e != fileArr[idx]));
  }

  return (
    <Box position={"relative"}>
      <Image
        width={"200px"}
        height={"215px"}
        objectFit={"cover"}
        borderRadius={"5.82474px"}
        src={URL.createObjectURL(fileArr[idx])}
        style={
          selectedFiles.indexOf(fileArr[idx]) > -1
            ? selectedStyle
            : previewStyle
        }
        onClick={updateSelections}
      ></Image>
      <Box position={"absolute"} top={1} right={5}>
        <CloseButton onClick={removeFile}></CloseButton>
      </Box>
    </Box>
  );
}

export default FilePreview;
