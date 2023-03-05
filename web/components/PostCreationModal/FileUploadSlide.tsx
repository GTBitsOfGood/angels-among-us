import FileDropZone from "./FileDropZone";
import { Grid, Stack } from "@chakra-ui/react";
import FilePreview from "./FilePreview";
import { Dispatch, SetStateAction } from "react";

interface PropsType {
  fileArr: Array<File>;
  setFileArr: Dispatch<SetStateAction<Array<File>>>;
  numFiles: number;
  numVideos: number;
  selectedFiles: Array<File>;
  setSelectedFiles: Dispatch<SetStateAction<Array<File>>>;
}

function FileUploadSlide(props: PropsType) {
  const {
    fileArr,
    setFileArr,
    selectedFiles,
    setSelectedFiles,
    numFiles,
    numVideos,
  } = props;

  return (
    <Stack>
      {numFiles <= 0 ? (
        <FileDropZone
          fileArr={fileArr}
          setFileArr={setFileArr}
          numFiles={numFiles}
          numVideos={numVideos}
        ></FileDropZone>
      ) : (
        <></>
      )}

      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        {fileArr.map((file) => (
          <FilePreview
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
            numVideos={numVideos}
          ></FileDropZone>
        ) : (
          <></>
        )}
      </Grid>
    </Stack>
  );
}

export default FileUploadSlide;
