import { Heading, Stack } from "@chakra-ui/react";
import React, { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  heading: string;
}

const Section: React.FC<Props> = ({ heading, children }) => {
  return (
    <Stack direction="column" spacing={5}>
      <Heading size="md">{heading}</Heading>
      <>{children}</>
    </Stack>
  );
};

export default Section;
