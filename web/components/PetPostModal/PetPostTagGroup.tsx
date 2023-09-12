import {
  Stack,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
export default function PetPostTagGroup(props: {
  title: string;
  tags: Array<String>;
  icons: Array<React.ElementType>;
}) {
  return (
    <Stack direction="column" spacing={3}>
      <Text fontWeight="bold" fontSize="xl" fontFamily="sans-serif">
        {props.title}
      </Text>
      <Wrap>
        {props.tags.map((tag, index) => {
          return (
            <WrapItem key={index}>
              <Tag size={"lg"} bgColor="#C6E3F9" borderRadius="25px">
                <TagLeftIcon as={props.icons[index]} />
                <TagLabel>{tag}</TagLabel>
              </Tag>
            </WrapItem>
          );
        })}
      </Wrap>
    </Stack>
  );
}
