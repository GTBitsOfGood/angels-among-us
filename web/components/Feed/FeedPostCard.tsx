import { Card, Flex, Image, Text } from "@chakra-ui/react";

export type PostCard = {
  image: string;
  date: string;
  title: string;
  tags: string[];
  body: string;
};

function FeedPostCard(props: { post: PostCard }) {
  const { post } = props;

  return (
    <Card
      marginBottom="0px"
      paddingX={{ base: "12px", lg: "16px" }}
      paddingY={{ base: "16px", lg: "20px" }}
      borderRadius="14px"
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
            {post.title}
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
            {post.tags[0]}
          </Text>
          <Text fontSize="14px" lineHeight="18px" color="#656565">
            {post.body}
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
}

export default FeedPostCard;
