import { Flex } from "@chakra-ui/react";

export default function Panel(props: { children: JSX.Element }) {
  return (
    <Flex
      bgColor={["white", "bg-primary"]}
      flexDir="row"
      w="100%"
      h="100%"
      justifyContent="center"
    >
      <Flex
        bgColor="white"
        direction="column"
        alignItems="center"
        justifyContent={"flex-start"}
        p={8}
        mt={[14, 100]}
        mb={[0, 50, 100]}
        gap={[4, 4, 0.05]}
        width={["100%", "90%", "80%"]}
        borderRadius={12}
      >
        {props.children}
      </Flex>
    </Flex>
  );
}
