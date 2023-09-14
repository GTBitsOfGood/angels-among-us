import { Card, Flex, Image, Text } from "@chakra-ui/react";

export type PostCard = {
  image: string;
  date: string;
  name: string;
  tags: string;
  description: string;
};

function FeedPostCard(props: { post: PostCard }) {
  const { post } = props;

  const splitTag = post.tags.split(/(?=[A-Z])/);
  const formattedTag = splitTag.reduce((acc, curr) => {
    return acc.concat(curr.charAt(0).toUpperCase() + curr.substring(1) + " ");
  }, "");

  return (
    <Card
      marginBottom="0px"
      paddingX={{ base: "12px", lg: "16px" }}
      paddingY={{ base: "16px", lg: "20px" }}
      borderRadius="14px"
      width={{ lg: "52vw" }}
    >
      <Flex gap={{ base: "15px", lg: "20px" }}>
        <Image
          src={post.image}
          objectFit="cover"
          minWidth={{ base: "120px", lg: "150px" }}
          width={{ base: "120px", lg: "150px" }}
          height={{ base: "120px", lg: "150px" }}
          backgroundColor="#D9D9D9"
          borderRadius="14px"
        ></Image>
        <Flex
          direction="column"
          width="80%"
          marginTop={{ base: "0px", lg: "8px" }}
          marginRight="20px"
        >
          <Text fontSize="14px">{post.date}</Text>
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
            {formattedTag.substring(0, formattedTag.length - 1)}
          </Text>
          <Text fontSize="14px" lineHeight="18px" color="#656565">
            {post.description}
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
}

export default FeedPostCard;
