import { IAccount } from "../../utils/types/account";
import { Role } from "../../utils/types/account";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Box,
  Flex,
  useDisclosure,
  Portal,
} from "@chakra-ui/react";
import { Dispatch, SetStateAction, useRef } from "react";

interface PropertyType {
  account: IAccount;
  accountList: IAccount[];
  updateAccountList: Dispatch<SetStateAction<IAccount[]>>;
}

function RoleSelector(props: PropertyType) {
  const { account, accountList, updateAccountList } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  var idx = accountList.indexOf(account);

  const ops = [
    { label: "Admin", role: Role.Admin },
    { label: "Content Creator", role: Role.ContentCreator },
    { label: "Volunteer", role: Role.Volunteer },
  ];

  function changeRole(r: Role) {
    var temp = {
      email: account.email,
      role: r,
    };
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
      gutter={0.5}
      //   trigger="hover"
    >
      <PopoverTrigger>
        <Box
          as="button"
          bgColor="#CECCCC"
          borderRadius="8px"
          width="147px"
          height="36px"
        >
          {createLabel(accountList[idx].role)}
        </Box>
      </PopoverTrigger>
      <Portal>
        <PopoverContent padding={2} maxW="210px">
          <Flex
            flexDirection="column"
            gap={2}
            alignItems="center"
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
                    width="147px"
                    height="36px"
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

function createLabel(r: Role) {
  var labelText = "";
  if (r === Role.Admin) {
    labelText = "Admin";
  } else if (r === Role.Volunteer) {
    labelText = "Volunteer";
  } else {
    labelText = "Content Creator";
  }
  return labelText;
}
