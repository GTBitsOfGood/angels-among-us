import FileDropZone from "./FileDropZone";
import FilePreview from "./FilePreview";
import { Alert, AlertIcon, Grid, Stack } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";

interface PropsType {
  fileArr: Array<File>;
  setFileArr: Dispatch<SetStateAction<Array<File>>>;
  numFiles: number;
  selectedFiles: Array<File>;
  setSelectedFiles: Dispatch<SetStateAction<Array<File>>>;
  showAlert: boolean;
  setShowAlert: Dispatch<SetStateAction<boolean>>;
}

function FileUploadSlide(props: PropsType) {
  const {
    fileArr,
    setFileArr,
    selectedFiles,
    setSelectedFiles,
    numFiles,
    showAlert,
    setShowAlert,
  } = props;

  return (
    <Stack overflow={"hidden"} alignItems={"center"} minHeight={"444px"}>
      {numFiles <= 0 ? (
        <FileDropZone
          fileArr={fileArr}
          setFileArr={setFileArr}
          numFiles={numFiles}
          setShowAlert={setShowAlert}
        ></FileDropZone>
      ) : (
        <></>
      )}
      <Grid templateColumns="repeat(3, 1fr)" columnGap={"22px"} rowGap={"22px"}>
        {fileArr.map((file) => (
          <FilePreview
            key={fileArr.indexOf(file)}
            idx={fileArr.indexOf(file)}
            fileArr={fileArr}
            selectedFiles={selectedFiles}
            setSelectedFiles={setSelectedFiles}
            setFileArr={setFileArr}
          ></FilePreview>
        ))}
        {numFiles > 0 && numFiles < 6 ? (
          <FileDropZone
            fileArr={fileArr}
            setFileArr={setFileArr}
            numFiles={numFiles}
            setShowAlert={setShowAlert}
          ></FileDropZone>
        ) : (
          <></>
        )}
      </Grid>
      {showAlert ? (
        <Alert status="error">
          <AlertIcon />
          Please upload up to 6 photos or video (one video limit).
        </Alert>
      ) : (
        <></>
      )}
    </Stack>
  );
}

export default FileUploadSlide;
