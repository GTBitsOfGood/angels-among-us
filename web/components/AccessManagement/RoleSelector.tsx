import { IAccount, roleLabels } from "../../utils/types/account";
import { Role } from "../../utils/types/account";
import { trpc } from "../../utils/trpc";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Box,
  Flex,
  useDisclosure,
} from "@chakra-ui/react";

interface PropertyType {
  account: IAccount;
}

function RoleSelector(props: PropertyType) {
  const { account } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const mutation = trpc.account.modify.useMutation();
  const utils = trpc.useUtils();

  const options = Object.entries(roleLabels).map(([k, v]) => ({
    key: k as Role,
    label: v,
  }));

  const handleRoleChange = (account: IAccount, newRole: Role) => {
    mutation.mutate(
      { role: newRole, email: account.email },
      {
        onSuccess() {
          utils.account.invalidate();
        },
      }
    );
  };

  return (
    <Popover
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      placement="bottom-start"
    >
      <PopoverTrigger>
        <Box
          as="button"
          bgColor="tag-primary-bg"
          disabled={mutation.isLoading}
          borderRadius={8}
          paddingX={2}
          alignItems="center"
          justifyContent="center"
        >
          {roleLabels[account.role]}
        </Box>
      </PopoverTrigger>
      <PopoverContent p={2} w="fit-content">
        <Flex
          flexDirection="column"
          gap={2}
          alignItems="left"
          onClick={onClose}
        >
          {options
            .filter((option) => option.key !== account.role)
            .map((option) => {
              return (
                <Box
                  key={option.key}
                  onClick={() => handleRoleChange(account, option.key)}
                  as="button"
                  bgColor="tag-primary-bg"
                  paddingX={2}
                  borderRadius={8}
                  w="fit-content"
                >
                  {option.label}
                </Box>
              );
            })}
        </Flex>
      </PopoverContent>
    </Popover>
  );
}
export default RoleSelector;
