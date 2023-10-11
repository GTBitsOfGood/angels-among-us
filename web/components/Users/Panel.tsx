import { Flex } from "@chakra-ui/react";

export default function Panel(props: { width: string; children: JSX.Element }) {
  return (
    <Flex
      bgColor="#D7E4EE"
      flexDir="row"
      height="100%"
      maxHeight="100%"
      justifyContent="center"
      paddingTop="80px"
      width="100%"
    >
      <Flex
        flex="1"
        bgColor="white"
        direction="column"
        alignItems="center"
        justifyContent={"flex-start"}
        marginX={{ sm: "20px", md: "100px", lg: "170px" }}
        marginY="30px"
        gap={[4, 4, 0.05]}
        width={props.width}
        borderRadius={"12px 12px 0 0"}
        boxShadow="0px 4px 20px 2px rgba(0, 0, 0, 0.1);"
      >
        {props.children}
      </Flex>
    </Flex>
  );
}
