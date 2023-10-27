import { Alert, AlertIcon, Grid, Stack } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";
import FileDropZone from "../PostCreationModal/FileUpload/FileDropZone";
import FilePreview from "../PostCreationModal/FileUpload/FilePreview";

interface PropsType {
  fileArr: Array<File>;
  setFileArr: Dispatch<SetStateAction<Array<File>>>;
  selectedFiles: Array<File>;
  setSelectedFiles: Dispatch<SetStateAction<Array<File>>>;
  showAlert: boolean;
  setShowAlert: Dispatch<SetStateAction<boolean>>;
}

function EditUploadSlide(props: PropsType) {
  const {
    fileArr,
    setFileArr,
    selectedFiles,
    setSelectedFiles,
    showAlert,
    setShowAlert,
  } = props;

  return (
    <Stack overflow={"hidden"} alignItems={"center"}>
      {fileArr.length === 0 && (
        <FileDropZone
          fileArr={fileArr}
          setFileArr={setFileArr}
          setShowAlert={setShowAlert}
        ></FileDropZone>
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
        {fileArr.length > 0 && fileArr.length < 6 ? (
          <FileDropZone
            fileArr={fileArr}
            setFileArr={setFileArr}
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

export default EditUploadSlide;
