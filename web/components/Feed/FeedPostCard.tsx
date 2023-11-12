import { Card, Center, Flex, Image, Text } from "@chakra-ui/react";
import DefaultDog from "../../public/dog.svg";
import dayjs from "dayjs";
import { fosterTypeLabels, IFeedPost } from "../../utils/types/post";

function DefaultDogImage() {
  return (
    <Center
      minWidth={{ base: "120px", lg: "150px" }}
      width={{ base: "120px", lg: "150px" }}
      height={{ base: "120px", lg: "150px" }}
      backgroundColor="#D9D9D9"
      borderRadius="14px"
    >
      <DefaultDog
        fill="white"
        width="75px"
        height="75px"
        style={{ paddingBottom: "10px" }}
      />
    </Center>
  );
}

function FeedPostCard(props: { post: IFeedPost }) {
  const { post } = props;

  let firstImage;
  const imageExtensions = new Set<string>(["png", "jpeg", "jpg"]);
  for (let i = 0; i < post.attachments.length; i++) {
    const filenameSplit = post.attachments[i].split(".");
    if (
      imageExtensions.has(filenameSplit[filenameSplit.length - 1].toLowerCase())
    ) {
      firstImage = post.attachments[i];
      break;
    }
  }

  const formattedDate = dayjs(post.date.toString())
    .format("MM/DD/YYYY hh:mm A")
    .toString();

  return (
    <Flex position="relative" marginBottom={4}>
      <Card
        paddingX={{ base: "12px", lg: "16px" }}
        paddingY={{ base: "16px", lg: "20px" }}
        borderRadius="14px"
        width="100%"
        shadow={"none"}
        border={{ base: "1px solid #7d7e82a8", lg: "none" }}
      >
        <Flex gap={{ base: "15px", lg: "20px" }}>
          {firstImage ? (
            <Image
              src={firstImage}
              objectFit="cover"
              minWidth={{ base: "120px", lg: "150px" }}
              width={{ base: "120px", lg: "150px" }}
              height={{ base: "120px", lg: "150px" }}
              backgroundColor="#D9D9D9"
              borderRadius="14px"
            ></Image>
          ) : (
            <DefaultDogImage />
          )}
          <Flex direction="column" width="80%" marginRight="20px">
            <Text fontSize="14px">{formattedDate}</Text>
            <Text
              position="absolute"
              top={5}
              right={5}
              display={{ base: "none", lg: post.covered ? "flex" : "none" }}
              fontSize={20}
              fontWeight="semibold"
              zIndex={3}
            >
              Covered Post
            </Text>
            <Text
              position="absolute"
              top={5}
              right={5}
              display={{
                base: "none",
                lg: post.userAppliedTo && !post.covered ? "flex" : "none",
              }}
              fontSize={20}
              fontWeight="semibold"
              zIndex={3}
            >
              Already Applied
            </Text>
            <Text margin="0px" paddingY="0px" fontWeight="bold" fontSize="18px">
              {post.name}
            </Text>
            <Text
              margin="0px"
              backgroundColor="#C6E3F9"
              width="fit-content"
              paddingX="16px"
              paddingY="4px"
              borderRadius="20px"
              marginTop="5px"
              marginBottom="10px"
              fontSize="14px"
              fontWeight="semibold"
            >
              {fosterTypeLabels[post.type]}
            </Text>
            <Text fontSize="14px" lineHeight="18px" color="#656565">
              {post.description}
            </Text>
          </Flex>
        </Flex>
      </Card>
      <Card
        position="absolute"
        width={"100%"}
        height={"100%"}
        top={0}
        right={0}
        opacity={post.covered ? "30%" : post.userAppliedTo ? "25%" : "0%"}
        backgroundColor={
          post.covered ? "#57a0d5" : post.userAppliedTo ? "#7D7E82" : "white"
        }
        borderRadius="14px"
      ></Card>
    </Flex>
  );
}

export default FeedPostCard;
