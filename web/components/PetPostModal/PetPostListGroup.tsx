import { Stack, Text, UnorderedList, ListItem, Flex } from "@chakra-ui/react";
export default function PetPostListGroup(props: {
  title: string;
  tags: Array<string> | undefined;
}) {
  return (
    <Stack direction="column" spacing={3} width={"100%"}>
      <Text fontWeight="extrabold" fontSize="xl" letterSpacing="wide">
        {props.title}
      </Text>
      <Flex
        flexDirection={["row", "column"]}
        flexBasis={2}
        flexWrap={["wrap", "nowrap"]}
      >
        {props.tags?.map((tag, index) => {
          return (
            <Stack key={index} width={["50%", "100%"]}>
              <UnorderedList>
                <ListItem>
                  <Text>{tag}</Text>
                </ListItem>
              </UnorderedList>
            </Stack>
          );
        })}
      </Flex>
    </Stack>
  );
}
