import React from "react";
import { Center, Flex, Heading, Link as ChakraLink } from "@chakra-ui/react";
import Link from "next/link";
import { Pages } from "../utils/consts";

const PageNotFoundError: React.FC = () => {
  return (
    <Center w="100%" h="100%">
      <Flex direction="column">
        <Heading size="lg">
          Sorry, the page you were looking for was not found.
        </Heading>
        <ChakraLink as={Link} color="text-primary" href={Pages.FEED}>
          Return to home
        </ChakraLink>
      </Flex>
    </Center>
  );
};

export default PageNotFoundError;
