import { Card, Flex, Image, Text } from "@chakra-ui/react";

function FeedPostCard(props: {
  date: string;
  title: string;
  tags: string[];
  body: string;
}) {
  const { date, title, tags, body } = props;

  return (
    <Card
      margin="20px"
      marginBottom="0px"
      width="95%"
      paddingX={{ base: "12px", lg: "16px" }}
      paddingY={{ base: "16px", lg: "20px" }}
      borderRadius="14px"
    >
      <Flex gap={{ base: "15px", lg: "20px" }}>
        <Image
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
          <Text fontSize="14px">{date}</Text>
          <Text margin="0px" paddingY="0px" fontWeight="bold" fontSize="18px">
            {title}
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
            {tags[0]}
          </Text>
          <Text fontSize="14px" lineHeight="18px" color="#656565">
            {body}
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
}

export default FeedPostCard;
