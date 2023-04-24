import { IAccount, Role } from "../../utils/types/account";
import { HydratedDocument } from "mongoose";
import RoleSelector from "./RoleSelector";
import { Box, Flex, HStack, SimpleGrid, Spacer, Text } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";

interface PropertyType {
  account: HydratedDocument<IAccount>;
  idx: Number;
  selectItems: boolean;
  itemsToDelete: Number[];
  updateItemsToDelete: Dispatch<SetStateAction<Number[]>>;
  accountList: HydratedDocument<IAccount>[];
  updateAccountList: Dispatch<SetStateAction<HydratedDocument<IAccount>[]>>;
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
    updateAccountList,
  } = props;

  let cardStyle = {
    border: "none",
  };

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
      width={{ sm: "90%", md: "90%", lg: "100%" }}
    >
      <HStack justifyContent={"space-between"} minH={"43px"} padding="12px">
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
            maxWidth={"60%"}
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
              updateAccountList={updateAccountList}
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
