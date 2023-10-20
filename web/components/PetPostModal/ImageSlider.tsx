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
            alignItems="center"
            maxHeight={["50vh", "65vh"]}
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
            alignItems="center"
            maxHeight={["50vh", "65vh"]}
          >
            <Flex onClick={clickHandler} cursor="pointer">
              <FaArrowCircleRight size={30} />
            </Flex>
          </Flex>
        );
      }}
    >
      {/* Implement video previews */}
      {props.attachments.length > 0
        ? props.attachments?.map((slide) => {
            return (
              <Flex
                justifyContent={"center"}
                alignItems={"center"}
                bgColor={"tag-primary-bg"}
                borderRadius="15px"
                overflow={"hidden"}
                minHeight={["40vh", "65vh"]}
                key={slide}
                paddingX={0}
              >
                <Image
                  src={slide}
                  objectFit={"cover"}
                  verticalAlign={"true"}
                  align="center"
                  maxHeight={["40vh", "65vh"]}
                  alt=""
                />
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
