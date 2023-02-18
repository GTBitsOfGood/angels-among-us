import { IAccount } from "../../utils/types/account";
import { Role } from "../../utils/types/account";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Box,
  Flex,
} from "@chakra-ui/react";

interface PropertyType {
  account: IAccount;
  accountList: IAccount[];
  updateAccountList: Function;
}

function RoleSelector(props: PropertyType) {
  const { account, accountList, updateAccountList } = props;
  var idx = accountList.indexOf(account);

  const ops = [
    { label: "Admin", role: Role.Admin },
    { label: "Content Creator", role: Role.ContentCreator },
    { label: "Volunteer", role: Role.Volunteer },
  ];

  function changeRole(r: Role) {
    console.log("changing to:");
    console.log(r);
    var temp = {
      email: account.email,
      role: r,
    };
    var tempList = [...accountList];
    tempList[idx] = temp;
    updateAccountList(tempList);
  }

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

  return (
    <Popover placement="bottom" gutter={0.5}>
      <PopoverTrigger>
        <Box
          as="button"
          bgColor="#CECCCC"
          borderRadius="8px"
          maxWidth="208px"
          minWidth="170px"
          height="36px"
        >
          {createLabel(accountList[idx].role)}
        </Box>
      </PopoverTrigger>
      <PopoverContent padding={2} maxW="210px">
        <Flex flexDirection="column" gap={2} alignItems="center">
          {ops
            .filter((option) => option.role != accountList[idx].role)
            .map((option) => {
              return (
                <Box
                  onClick={() => changeRole(option.role)}
                  key={ops.indexOf(option)}
                >
                  <Box
                    as="button"
                    bgColor="#CECCCC"
                    borderRadius="8px"
                    width="200px"
                    height="36px"
                  >
                    {option.label}
                  </Box>
                </Box>
              );
            })}
        </Flex>
      </PopoverContent>
    </Popover>
  );
}
export default RoleSelector;
