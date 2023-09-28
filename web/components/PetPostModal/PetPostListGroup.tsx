import { Stack, Text, UnorderedList, ListItem } from "@chakra-ui/react";
export default function PetPostListGroup(props: {
  title: string;
  tags: Array<string> | undefined;
}) {
  return (
    <Stack direction="column" spacing={3}>
      <Text fontWeight="bold" fontSize="xl" fontFamily="sans-serif">
        {props.title}
      </Text>
      <UnorderedList>
        {props.tags?.map((tag, index) => {
          return (
            <ListItem key={index}>
              <Text>{tag}</Text>
            </ListItem>
          );
        })}
      </UnorderedList>
    </Stack>
  );
}
