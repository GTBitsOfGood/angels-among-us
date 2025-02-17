import { roleLabels } from "../../utils/types/account";
import { Role } from "../../utils/types/account";
import { trpc } from "../../utils/trpc";
import { IUser } from "../../utils/types/user";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Box,
  Flex,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";

interface PropertyType {
  requestedUser: IUser;
}

function ApproveSelector(props: PropertyType) {
  const { requestedUser } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const mutation = trpc.account.add.useMutation();
  const utils = trpc.useUtils();

  const options = Object.entries(roleLabels).map(([k, v]) => ({
    key: k as Role,
    label: v,
  }));

  const handleApprove = (requestedUser: IUser, newRole: Role) => {
    mutation.mutate(
      { email: requestedUser.email, role: newRole },
      {
        onSuccess() {
          utils.user.invalidate();
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
        <Flex
          direction="row"
          as="button"
          bgColor="green.200"
          disabled={mutation.isLoading}
          borderRadius={8}
          paddingX={3}
          paddingY={1}
          alignItems="center"
          justifyContent="center"
          gap={1}
        >
          <Text>Approve</Text>
          {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </Flex>
      </PopoverTrigger>
      <PopoverContent p={2} w="fit-content">
        <Flex
          flexDirection="column"
          gap={2}
          alignItems="left"
          onClick={onClose}
        >
          {options.map((option) => {
            return (
              <Box
                key={option.key}
                onClick={() => handleApprove(requestedUser, option.key)}
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
export default ApproveSelector;
