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
import { Dispatch, SetStateAction } from "react";

interface PropertyType {
  account: IAccount;
  accountList: IAccount[];
  updateAccountList: Dispatch<SetStateAction<IAccount[]>>;
  createLabel: CallableFunction;
}

function RoleSelector(props: PropertyType) {
  const { account, accountList, updateAccountList, createLabel } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  var idx = accountList.indexOf(account);

  const mutation = trpc.account.modify.useMutation();

  const ops = [
    { label: "Admin", role: Role.Admin },
    { label: "Creator", role: Role.ContentCreator },
    { label: "Volunteer", role: Role.Volunteer },
  ];

  function changeRole(r: Role) {
    var temp = {
      email: account.email,
      role: r,
    };
    mutation.mutate({ role: r, email: account.email });
    var tempList = [...accountList];
    tempList[idx] = temp;
    updateAccountList(tempList);
  }

  return (
    <Popover
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      placement="bottom"
      offset={[50, 0]}
    >
      <PopoverTrigger>
        <Box
          as="button"
          bgColor="#CECCCC"
          borderRadius="8px"
          width={"97px"}
          height={"27px"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          {createLabel(accountList[idx].role)}
        </Box>
      </PopoverTrigger>
      <Portal>
        <PopoverContent padding={2} maxW="200px">
          <Flex
            flexDirection="column"
            gap={2}
            alignItems="left"
            onClick={onClose}
          >
            {ops
              .filter((option) => option.role != accountList[idx].role)
              .map((option) => {
                return (
                  <Box
                    key={ops.indexOf(option)}
                    onClick={() => changeRole(option.role)}
                    as="button"
                    bgColor="#CECCCC"
                    borderRadius="8px"
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
