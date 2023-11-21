import { Flex, Image, Circle } from "@chakra-ui/react";
import { Carousel } from "react-responsive-carousel";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import DefaultDog from "../../public/dog.svg";
import { useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";

function ImageSlider(props: { attachments: Array<string> }) {
  const videoTypes = new Set(["mp4", "mov"]);
  const [slideIndex, setSlideIndex] = useState(0);

  return (
    <Carousel
      axis="horizontal"
      dynamicHeight={false}
      showThumbs={false}
      showStatus={false}
      swipeable={false}
      infiniteLoop
      renderArrowPrev={(clickHandler, hasPrev) => {
        return (
          <Flex
            display={hasPrev ? "flex" : "none"}
            position="absolute"
            zIndex={2}
            top="50%"
            left={0}
            transform="translateY(-50%)"
            pl={3}
          >
            <ChevronLeftIcon
              onClick={clickHandler}
              cursor="pointer"
              boxSize={30}
              background="white"
              color="black"
              borderRadius="100"
              border="1px solid black"
            />
          </Flex>
        );
      }}
      renderArrowNext={(clickHandler, hasNext) => {
        return (
          <Flex
            display={hasNext ? "flex" : "none"}
            position="absolute"
            zIndex={2}
            top="50%"
            right={0}
            transform="translateY(-50%)"
            pr={3}
          >
            <Flex onClick={clickHandler} cursor="pointer">
              <ChevronRightIcon
                boxSize={30}
                background="white"
                color="black"
                borderRadius="100"
                border="1px solid black"
              />
            </Flex>
          </Flex>
        );
      }}
      onChange={(index) => setSlideIndex(index)}
      showIndicators={
        props.attachments.length > 0 &&
        !videoTypes.has(
          props.attachments[slideIndex].split(".").pop()!.toLowerCase()
        )
      }
      renderIndicator={(onClickHandler, isSelected, index) => {
        return (
          <Circle
            key={index}
            display="inline-block"
            onClick={onClickHandler}
            cursor="pointer"
            size={3}
            marginX={2}
            bg={isSelected ? "white" : "whiteAlpha.600"}
          />
        );
      }}
    >
      {props.attachments.length > 0
        ? props.attachments?.map((attachment) => {
            const isVideoType = videoTypes.has(
              attachment.split(".").pop()!.toLowerCase()
            );
            return (
              <Flex
                key={attachment}
                justifyContent={"center"}
                alignItems={"center"}
                borderRadius={12}
                height={{ base: "40dvh", md: "100%" }}
              >
                {isVideoType ? (
                  <Flex
                    alignItems={"center"}
                    justifyContent={"center"}
                    height={{ base: "40dvh", md: "100%" }}
                    p={2}
                  >
                    <Flex
                      w="100%"
                      h="100%"
                      overflow="hidden"
                      pos="absolute"
                      direction="row"
                      justifyContent="center"
                    >
                      <video
                        style={{
                          objectFit: "contain",
                          width: "auto",
                          height: "100%",
                        }}
                        controls
                        controlsList="nodownload"
                      >
                        <source src={attachment} />
                      </video>
                    </Flex>
                  </Flex>
                ) : (
                  <Image
                    key={attachment}
                    src={attachment}
                    objectFit="contain"
                    verticalAlign="true"
                    align="center"
                    w="auto"
                    h="100%"
                    alt=""
                  />
                )}
              </Flex>
            );
          })
        : [
            <Flex
              key="default"
              direction="column"
              justifyContent="center"
              alignItems="center"
              minHeight={{ base: "40dvh", md: "100%" }}
              width="100%"
            >
              <DefaultDog fill="white" height={"50%"} width={"50%"} />
            </Flex>,
          ]}
    </Carousel>
  );
}

export default ImageSlider;
