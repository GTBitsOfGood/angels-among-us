import { Flex } from "@chakra-ui/react";

export default function Panel(props: { children: JSX.Element }) {
  return (
    <Flex
      bgColor={["white", "bg-primary"]}
      flexDir="row"
      w="100%"
      h="100%"
      justifyContent="center"
      pt={[14, 100]}
      pb={{ base: 0, sm: 50 }}
    >
      <Flex
        bgColor="white"
        direction="column"
        alignItems="center"
        justifyContent={"flex-start"}
        paddingY={{ base: 4, sm: 8 }}
        width={["100%", "90%", "80%"]}
        borderRadius={12}
      >
        {props.children}
      </Flex>
    </Flex>
  );
}
