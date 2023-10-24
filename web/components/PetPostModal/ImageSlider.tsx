import { Flex, Image } from "@chakra-ui/react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { FaArrowCircleLeft, FaArrowCircleRight } from "react-icons/fa";
import DefaultDog from "../../public/dog.svg";

function ImageSlider(props: { attachments: Array<string> }) {
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
    >
      {props.attachments.length > 0
        ? props.attachments?.map((slide) => {
            return (
              <Flex
                justifyContent={"center"}
                alignItems={"center"}
                bgColor={
                  slide.slice(slide.length - 3) === "mp4"
                    ? "black"
                    : "tag-primary-bg"
                }
                borderRadius="15px"
                overflow={"hidden"}
                height={["40vh", "65vh"]}
                key={slide}
                paddingX={0}
              >
                {slide.slice(slide.length - 3) === "mp4" ? (
                  <Flex
                    alignItems={"center"}
                    justifyContent={"center"}
                    height={["40vh", "65vh"]}
                    width={["94%", "96%"]}
                    marginTop={10}
                  >
                    <iframe
                      src={slide}
                      key={slide}
                      height={"100%"}
                      width={"100%"}
                    ></iframe>
                  </Flex>
                ) : (
                  <Image
                    src={slide}
                    key={slide}
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
