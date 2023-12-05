import FileDropZone from "./FileDropZone";
import FilePreview from "./FilePreview";
import { Flex, Grid, GridItem } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";

interface PropsType {
  fileArr: Array<File>;
  setFileArr: Dispatch<SetStateAction<Array<File>>>;
}

function FileUploadSlide(props: PropsType) {
  const { fileArr, setFileArr } = props;

  return (
    <Flex w="100%" h="100%">
      <Grid
        templateColumns={{
          base: `repeat(${Math.min(2, fileArr.length + 1)}, 1fr)`,
          md: `repeat(${Math.min(3, fileArr.length + 1)}, 1fr)`,
        }}
        templateRows={{
          base: `repeat(${Math.ceil(
            (fileArr.length + (fileArr.length < 6 ? 1 : 0)) / 2
          )}, 1fr)`,
          md: `repeat(${Math.ceil(
            (fileArr.length + (fileArr.length < 6 ? 1 : 0)) / 3
          )}, 1fr)`,
        }}
        columnGap={4}
        rowGap={4}
        w="100%"
        h="100%"
      >
        {fileArr.map((file, i) => (
          <GridItem key={`${file.name}-${i}`} w="100%" overflow="hidden">
            <FilePreview
              idx={fileArr.indexOf(file)}
              fileArr={fileArr}
              setFileArr={setFileArr}
            />
          </GridItem>
        ))}
        {fileArr.length < 6 ? (
          <GridItem w="100%">
            <FileDropZone fileArr={fileArr} setFileArr={setFileArr} />
          </GridItem>
        ) : null}
      </Grid>
    </Flex>
  );
}

export default FileUploadSlide;
