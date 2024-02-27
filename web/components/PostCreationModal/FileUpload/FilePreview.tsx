import Image from "next/legacy/image";
import rotateImg from "./rotateImageHelper";
import { CloseIcon, RepeatIcon } from "@chakra-ui/icons";
import { Box, Button, Flex } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";

interface PropsType {
  fileArr: Array<File>;
  setFileArr: Dispatch<SetStateAction<Array<File>>>;
  idx: number;
}

function FilePreview(props: PropsType) {
  const { fileArr, setFileArr, idx } = props;

  function removeFile() {
    let temp = [...fileArr];
    temp.splice(idx, 1);
    setFileArr(temp);
  }

  function rotateImage() {
    rotateImg(URL.createObjectURL(fileArr[idx])).then((blob) => {
      let temp = [...fileArr];
      temp[idx] = new File(blob ? [blob] : [], fileArr[idx].name, {
        type: fileArr[idx].type,
      });
      setFileArr(temp);
    });
  }

  return (
    <Box
      w="100%"
      h="100%"
      position="relative"
      borderRadius={12}
      bgColor="#DDDDDD"
      overflow="hidden"
    >
      {fileArr[idx].type === "video/mp4" ||
      fileArr[idx].type === "video/quicktime" ? (
        <Flex
          w="100%"
          h="100%"
          justifyContent="center"
          alignItems="center"
          _hover={{ cursor: "pointer" }}
        >
          <video
            controls
            autoPlay={false}
            controlsList="nodownload"
            style={{
              objectFit: "contain",
              height: "100%",
              width: "auto",
            }}
          >
            <source
              src={URL.createObjectURL(fileArr[idx])}
              type="video/mp4"
            ></source>
          </video>
        </Flex>
      ) : (
        <Image
          src={URL.createObjectURL(fileArr[idx])}
          objectFit="contain"
          layout="fill"
        />
      )}

      <Box position={"absolute"} top={1} right={1}>
        {fileArr[idx].type !== "video/mp4" &&
          fileArr[idx].type !== "video/quicktime" && (
            <Button onClick={rotateImage} colorScheme={"blackAlpha"}>
              <RepeatIcon></RepeatIcon>
            </Button>
          )}
        <Button onClick={removeFile} colorScheme={"blackAlpha"}>
          <CloseIcon></CloseIcon>
        </Button>
      </Box>
    </Box>
  );
}

export default FilePreview;
