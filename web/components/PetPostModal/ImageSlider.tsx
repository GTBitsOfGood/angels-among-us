import Image from "next/legacy/image";
import { Flex, Circle, IconButton, Box } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import DefaultDog from "../../public/dog.svg";
import { useState } from "react";

function ImageSlider(props: { attachments: Array<string> }) {
  const { attachments } = props;
  const videoTypes = new Set(["mp4", "mov"]);
  const [slideIndex, setSlideIndex] = useState(0);

  if (attachments.length === 0) {
    return (
      <Flex
        direction="column"
        justifyContent="center"
        alignItems="center"
        minHeight={{ base: "40dvh", md: "100%" }}
        bgColor="#DDDDDD"
        width="100%"
        borderRadius={12}
      >
        <DefaultDog fill="white" height="50%" width="50%" />
      </Flex>
    );
  }

  const hasPrev = slideIndex - 1 >= 0;
  const hasNext = slideIndex + 1 < attachments.length;

  return (
    <Flex w="100%" h="100%" direction="column">
      <Flex
        position="relative"
        w="100%"
        h={{ base: "40dvh", md: "100%" }}
        direction="row"
        justifyContent="center"
        alignItems="center"
        borderRadius={12}
        bgColor="#DDDDDD"
        overflow="hidden"
      >
        <Flex
          display={hasPrev ? "flex" : "none"}
          position="absolute"
          zIndex={2}
          top="50%"
          left={3}
          transform="translateY(-50%)"
        >
          <IconButton
            isRound={true}
            variant="solid"
            colorScheme="brand"
            aria-label="left"
            size="sm"
            fontSize="20px"
            icon={<ChevronLeftIcon />}
            onClick={() => setSlideIndex((cur) => cur - 1)}
          />
        </Flex>
        <Flex
          display={hasNext ? "flex" : "none"}
          position="absolute"
          zIndex={2}
          top="50%"
          right={3}
          transform="translateY(-50%)"
        >
          <IconButton
            isRound={true}
            variant="solid"
            colorScheme="brand"
            aria-label="right"
            size="sm"
            fontSize="20px"
            icon={<ChevronRightIcon />}
            onClick={() =>
              setSlideIndex((cur) => (cur + 1) % attachments.length)
            }
          />
        </Flex>
        <>
          {attachments.map((attachment, i) => {
            const isVideoType = videoTypes.has(
              attachment.split(".").pop()!.toLowerCase()
            );
            if (isVideoType) {
              return (
                <video
                  key={attachment}
                  style={{
                    position: "absolute",
                    objectFit: "contain",
                    height: "100%",
                    width: "auto",
                    display: i === slideIndex ? "inline" : "none",
                  }}
                  controls
                  controlsList="nodownload"
                >
                  <source src={attachment} />
                </video>
              );
            }
            return (
              <Box
                key={attachment}
                w="100%"
                h="100%"
                display={i === slideIndex ? "inline" : "none"}
                pos="relative"
              >
                <Image
                  key={attachment}
                  src={attachment}
                  objectFit="contain"
                  layout="fill"
                  alt=""
                />
              </Box>
            );
          })}
        </>
      </Flex>
      {attachments.length > 1 && (
        <Flex
          paddingY={3}
          gap={2}
          w="100%"
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          {attachments.map((_, i) => {
            return (
              <Circle
                key={i}
                size={i === slideIndex ? 3 : 2}
                bg={i === slideIndex ? "text-primary" : "#DDDDDD"}
              />
            );
          })}
        </Flex>
      )}
    </Flex>
  );
}
export default ImageSlider;
