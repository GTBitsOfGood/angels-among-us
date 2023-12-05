import { Role, roleLabels } from "../../utils/types/account";
import { Radio, RadioGroup, Stack, Flex } from "@chakra-ui/react";
import React from "react";

interface PropertyType {
  setRole: React.Dispatch<React.SetStateAction<Role>>;
}
export default function PermissionSelector(props: PropertyType) {
  const { setRole } = props;

  const options = [Role.Admin, Role.ContentCreator, Role.Volunteer];

  return (
    <Flex>
      <RadioGroup
        defaultValue={Role.Volunteer}
        onChange={(value) => setRole(value as Role)}
      >
        <Stack
          spacing={{ base: 0, md: 4 }}
          direction={{ base: "column", md: "row" }}
        >
          {options.map((value) => (
            <Radio key={value} value={value} colorScheme="brand">
              {roleLabels[value]}
            </Radio>
          ))}
        </Stack>
      </RadioGroup>
    </Flex>
  );
}
