import FileDropZone from "./FileDropZone";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Grid, Image, Stack } from "@chakra-ui/react";
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
function FileUploadSlide(props: PropsType) {
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

  useEffect(() => {
    setNumFiles(fileArr.length);
    console.log("FILE ARR");
    console.log(fileArr);
    console.log("NUMFILES");
    console.log(numFiles);
  }, [fileArr]);

  return (
    <Stack>
      {isFirstUpload ? (
        <FileDropZone
          isFirstUpload={isFirstUpload}
          setIsFirstUpload={setIsFirstUpload}
          filePreviewArr={filePreviewArr}
          setFilePreviewArr={setFilePreviewArr}
          fileArr={fileArr}
          setFileArr={setFileArr}
          numFiles={numFiles}
          setNumFiles={setNumFiles}
          numVideos={numVideos}
          setNumVideos={setNumVideos}
        ></FileDropZone>
      ) : (
        <></>
      )}

      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        {filePreviewArr.map((file) => (
          <Image
            key={filePreviewArr.indexOf(file)}
            boxSize="200px"
            objectFit={"cover"}
            src={file.preview}
            onLoad={() => {
              URL.revokeObjectURL(file.preview);
            }}
          ></Image>
        ))}
        {!isFirstUpload && numFiles < 6 ? (
          <FileDropZone
            isFirstUpload={isFirstUpload}
            setIsFirstUpload={setIsFirstUpload}
            filePreviewArr={filePreviewArr}
            setFilePreviewArr={setFilePreviewArr}
            fileArr={fileArr}
            setFileArr={setFileArr}
            numFiles={numFiles}
            setNumFiles={setNumFiles}
            numVideos={numVideos}
            setNumVideos={setNumVideos}
          ></FileDropZone>
        ) : (
          <></>
        )}
      </Grid>
    </Stack>
  );
}

export default FileUploadSlide;
