import { Flex, Image } from "@chakra-ui/react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { FaArrowCircleLeft, FaArrowCircleRight } from "react-icons/fa";

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
            maxHeight={["50vh", "75vh"]}
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
            maxHeight={["50vh", "75vh"]}
          >
            <Flex onClick={clickHandler} cursor="pointer">
              <FaArrowCircleRight size={30} />
            </Flex>
          </Flex>
        );
      }}
    >
      {props.attachments?.map((slide) => {
        return (
          <Image
            key={slide}
            src={slide}
            borderRadius="15px"
            objectFit="cover"
            width="full"
            height="full"
            maxHeight={["50vh", "75vh"]}
            alt=""
          />
        );
      })}
    </Carousel>
  );
}

export default ImageSlider;
