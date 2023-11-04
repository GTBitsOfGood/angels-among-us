import { IAccount } from "../../utils/types/account";
import { Role } from "../../utils/types/account";
import { trpc } from "../../utils/trpc";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Box,
  Flex,
  useDisclosure,
  Portal,
} from "@chakra-ui/react";

interface PropertyType {
  account: IAccount;
  accountList: IAccount[];
  createLabel: CallableFunction;
}

function RoleSelector(props: PropertyType) {
  const { account, accountList, createLabel } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const idx = accountList.indexOf(account);

  const mutation = trpc.account.modify.useMutation();
  const utils = trpc.useContext();

  const ops = [
    { label: "Admin", role: Role.Admin },
    { label: "Creator", role: Role.ContentCreator },
    { label: "Volunteer", role: Role.Volunteer },
  ];

  const changeRole = async (r: Role) => {
    updateDB({ role: r, email: account.email });
  };

  const updateDB = (item: IAccount) => {
    mutation.mutate(
      { role: item.role, email: account.email },
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
      placement="bottom"
      offset={[0, -35]}
    >
      <PopoverTrigger>
        <Box
          as="button"
          bgColor="#C6E3F9"
          borderRadius="8px"
          width={"97px"}
          height={"27px"}
          alignItems={"center"}
          justifyContent={"center"}
          disabled={mutation.isLoading}
        >
          {createLabel(accountList[idx].role)}
        </Box>
      </PopoverTrigger>
      <Portal>
        <PopoverContent
          maxW={106}
          borderRadius="8px"
          border={"1px solid #747373"}
        >
          <Flex
            flexDirection="column"
            gap={2}
            alignItems="center"
            onClick={onClose}
            paddingTop={2}
            paddingBottom={2}
          >
            <Box
              as="button"
              bgColor="#C6E3F9"
              borderRadius="8px"
              width={"97px"}
              height={"27px"}
              alignItems={"center"}
              justifyContent={"center"}
              disabled={mutation.isLoading}
            >
              {createLabel(accountList[idx].role)}
            </Box>
            {ops
              .filter((option) => option.role != accountList[idx].role)
              .map((option) => {
                return (
                  <Box
                    key={ops.indexOf(option)}
                    onClick={() => changeRole(option.role)}
                    as="button"
                    borderRadius="8px"
                    border="1px solid"
                    borderColor={"#BBBBBB"}
                    width={"97px"}
                    height={"27px"}
                    alignItems={"center"}
                    justifyContent={"center"}
                  >
                    {option.label}
                  </Box>
                );
              })}
          </Flex>
        </PopoverContent>
      </Portal>
    </Popover>
  );
}
export default RoleSelector;
