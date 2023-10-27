import { Flex, Image, Circle } from "@chakra-ui/react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { FaArrowCircleLeft, FaArrowCircleRight } from "react-icons/fa";
import DefaultDog from "../../public/dog.svg";
import { useState } from "react";

function ImageSlider(props: { attachments: Array<string> }) {
  const videoTypes = new Set(["mp4", "mov"]);
  const [slideIndex, setSlideIndex] = useState(0);

  return (
    <Carousel
      axis="horizontal"
      showStatus={false}
      swipeable={false}
      infiniteLoop
      renderArrowPrev={(clickHandler, hasPrev) => {
        return (
          <Flex
            position="absolute"
            display={hasPrev ? "flex" : "none"}
            zIndex={2}
            top={0}
            bottom={0}
            left={0}
            p={3}
            alignItems="flex-end"
            maxHeight={["23.5vh", "35.5vh"]}
          >
            <Flex onClick={clickHandler} cursor="pointer">
              <FaArrowCircleLeft size={30} />
            </Flex>
          </Flex>
        );
      }}
      renderArrowNext={(clickHandler, hasNext) => {
        return (
          <Flex
            position="absolute"
            display={hasNext ? "flex" : "none"}
            zIndex={2}
            top={0}
            bottom={0}
            right={0}
            p={3}
            alignItems="flex-end"
            maxHeight={["23.5vh", "35.5vh"]}
          >
            <Flex onClick={clickHandler} cursor="pointer">
              <FaArrowCircleRight size={30} />
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
                justifyContent={"center"}
                alignItems={"center"}
                bgColor={isVideoType ? "black" : "tag-primary-bg"}
                borderRadius="15px"
                overflow={"hidden"}
                height={["40vh", "65vh"]}
                key={attachment}
                paddingX={0}
              >
                {isVideoType ? (
                  <Flex
                    alignItems={"center"}
                    justifyContent={"center"}
                    height={["40vh", "65vh"]}
                    width={["94%", "96%"]}
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
                    objectFit={"cover"}
                    verticalAlign={"true"}
                    align="center"
                    maxHeight={["40vh", "65vh"]}
                    alt=""
                  />
                )}
              </Flex>
            );
          })
        : [
            <Flex
              key={"default"}
              direction={"column"}
              justifyContent={"center"}
              alignItems={"center"}
              borderRadius="15px"
              minHeight={["40vh", "65vh"]}
              minWidth={{ lg: "20vw" }}
              width={"100%"}
              paddingBottom={10}
              bgColor={"#DDDDDD"}
            >
              <DefaultDog fill="white" height={"50%"} width={"50%"} />
            </Flex>,
          ]}
    </Carousel>
  );
}

export default ImageSlider;
