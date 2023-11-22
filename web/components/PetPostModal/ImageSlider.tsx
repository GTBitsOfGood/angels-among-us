import { Flex, Image, Circle, IconButton } from "@chakra-ui/react";
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
        width="100%"
      >
        <DefaultDog fill="white" height={"50%"} width={"50%"} />
      </Flex>
    );
  }

  const attachment = attachments[slideIndex];
  const isVideoType = videoTypes.has(
    attachment.split(".").pop()!.toLowerCase()
  );

  const hasPrev = slideIndex - 1 >= 0;
  const hasNext = slideIndex + 1 < attachments.length;

  return (
    <Flex
      position="relative"
      w="100%"
      h={{ base: "40dvh", md: "100%" }}
      direction="row"
      justifyContent="center"
      alignItems="center"
      borderRadius={12}
      overflow="hidden"
    >
      <Flex
        display={hasPrev ? "flex" : "none"}
        position="absolute"
        zIndex={2}
        top="50%"
        left={4}
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
        right={4}
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
          onClick={() => setSlideIndex((cur) => (cur + 1) % attachments.length)}
        />
      </Flex>
      {isVideoType ? (
        <video
          style={{
            position: "absolute",
            objectFit: "contain",
            height: "100%",
            width: "auto",
          }}
          controls
          controlsList="nodownload"
        >
          <source src={attachment} />
        </video>
      ) : (
        <Image
          src={attachment}
          objectFit="contain"
          verticalAlign="true"
          align="center"
          w="auto"
          h="100%"
          alt=""
        />
      )}
      {!isVideoType && attachments.length > 1 && (
        <Flex position="absolute" bottom={4} gap={2}>
          {attachments.map((_, i) => {
            return (
              <Circle
                key={i}
                size={3}
                bg={i === slideIndex ? "white" : "whiteAlpha.600"}
              />
            );
          })}
        </Flex>
      )}
    </Flex>
  );
}
export default ImageSlider;
