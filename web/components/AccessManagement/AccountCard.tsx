import { IAccount, Role } from "../../utils/types/account";
import RoleSelector from "./RoleSelector";
import { Box, Flex, HStack, Text } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";

interface PropertyType {
  account: IAccount;
  idx: Number;
  selectItems: boolean;
  itemsToDelete: Number[];
  updateItemsToDelete: Dispatch<SetStateAction<Number[]>>;
  accountList: IAccount[];
}

function createLabel(r: Role) {
  let labelText = "";
  if (r === Role.Admin) {
    labelText = "Admin";
  } else if (r === Role.Volunteer) {
    labelText = "Volunteer";
  } else {
    labelText = "Creator";
  }
  return labelText;
}

function AccountCard(props: PropertyType) {
  const {
    account,
    idx,
    selectItems,
    itemsToDelete,
    updateItemsToDelete,
    accountList,
  } = props;

  let selectButtonStyle = {
    border: "solid",
    borderColor: "#BBBBBB",
    borderWidth: "1px",
    bgColor: "white",
  };

  if (itemsToDelete.indexOf(idx) > -1) {
    selectButtonStyle = {
      bgColor: "#529FD4",
      border: "solid",
      borderColor: "#BBBBBB",
      borderWidth: "1",
    };
  }

  function updateSelections() {
    if (itemsToDelete.indexOf(idx) > -1) {
      const temp = itemsToDelete.filter((e) => e != idx);
      updateItemsToDelete(temp);
    } else {
      const temp = [...itemsToDelete];
      temp.push(idx);
      updateItemsToDelete(temp);
    }
  }

  return (
    <Box
      borderRadius="12px"
      borderWidth={1}
      borderColor="#BBBBBB"
      maxW={{ sm: "90%", md: "90%", lg: "100%" }}
      maxH={"44px"}
    >
      <HStack justifyContent={"space-between"} minH={"43px"} paddingX="12px">
        <Flex
          justifyContent={"space-between"}
          alignItems={"center"}
          width={"80%"}
          flexWrap={"wrap"}
        >
          <Text
            fontWeight={"400"}
            fontSize={"16px"}
            lineHeight={"19px"}
            maxWidth={"70%"}
          >
            {account.email}
          </Text>
          {selectItems ? (
            <Box
              as="button"
              bgColor="#C6E3F9"
              borderRadius="8px"
              width={"97px"}
              height={"27px"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              {createLabel(account.role)}
            </Box>
          ) : (
            <RoleSelector
              account={account}
              accountList={accountList}
              createLabel={createLabel}
            ></RoleSelector>
          )}
        </Flex>
        {selectItems ? (
          <Box
            border={selectButtonStyle.border}
            borderWidth={selectButtonStyle.borderWidth}
            borderColor={selectButtonStyle.borderColor}
            bgColor={selectButtonStyle.bgColor}
            borderRadius="15px"
            minWidth="30px"
            minHeight="30px"
            onClick={updateSelections}
          ></Box>
        ) : (
          <Box minWidth="30px" minHeight="30px"></Box>
        )}
      </HStack>
    </Box>
  );
}

export default AccountCard;
