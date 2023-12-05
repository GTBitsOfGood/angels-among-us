import { Text, Stack } from "@chakra-ui/react";
import React, { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  heading: string;
}

const Section: React.FC<Props> = ({ heading, children }) => {
  return (
    <Stack direction="column" spacing={4}>
      <Text fontSize="lg" fontWeight="semibold">
        {heading}
      </Text>
      <>{children}</>
    </Stack>
  );
};

export default Section;
