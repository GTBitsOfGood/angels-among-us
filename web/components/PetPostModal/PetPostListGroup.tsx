import {
    Stack,
    Tag,
    TagLabel,
    TagLeftIcon,
    Text,
    UnorderedList,
    ListItem,
    Wrap,
    WrapItem,
  } from "@chakra-ui/react";
  export default function PetPostListGroup(props: {
    title: string;
    tags: Array<String>;
  }) {
    return (
      <Stack direction="column" spacing={3}>
        <Text fontWeight="bold" fontSize="xl" fontFamily="sans-serif">
          {props.title}
        </Text>
        <UnorderedList>
          {props.tags.map((tag) => {
            return (
              <ListItem>{tag}</ListItem>
            );
          })}
        </UnorderedList>
      </Stack>
    );
  }
  