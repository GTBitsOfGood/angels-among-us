import FileDropZone from "./FileDropZone";
import FilePreview from "./FilePreview";
import { Alert, AlertIcon, Box, Grid, Stack } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useEffect } from "react";

interface PropsType {
  fileArr: Array<File>;
  setFileArr: Dispatch<SetStateAction<Array<File>>>;
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
    showAlert,
    setShowAlert,
  } = props;

  return (
    <Stack alignItems={"center"} minW="100%" minH="100%">
      {fileArr.length === 0 && (
        <FileDropZone
          fileArr={fileArr}
          setFileArr={setFileArr}
          setShowAlert={setShowAlert}
        ></FileDropZone>
      )}
      <Grid
        templateColumns="repeat(3, 1fr)"
        columnGap={"22px"}
        rowGap={"22px"}
        w="100%"
        h="100%"
      >
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
        {fileArr.length > 0 && fileArr.length < 6 ? (
          <Box w="211px" h="211px">
            <FileDropZone
              fileArr={fileArr}
              setFileArr={setFileArr}
              setShowAlert={setShowAlert}
            ></FileDropZone>
          </Box>
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
