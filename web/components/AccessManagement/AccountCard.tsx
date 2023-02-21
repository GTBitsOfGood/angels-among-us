import { IAccount, Role } from "../../utils/types/account";
import RoleSelector from "./RoleSelector";
import { Box, Flex, SimpleGrid, Text, Wrap } from "@chakra-ui/react";
import styles from "./AccessManagementPage.module.css";
import { Dispatch, SetStateAction } from "react";

interface PropertyType {
  account: IAccount;
  idx: Number;
  selectItems: boolean;
  itemsToDelete: Number[];
  updateItemsToDelete: Dispatch<SetStateAction<Number[]>>;
  accountList: IAccount[];
  updateAccountList: Dispatch<SetStateAction<IAccount[]>>;
}

//TODO: put this somewhere else / component
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
    bgColor: "#EEEEEE",
    border: "solid",
    borderColor: "#000000",
    borderWidth: "1px",
  };

  if (itemsToDelete.indexOf(idx) > -1) {
    cardStyle = {
      border: "1.5px solid #000000",
    };
    selectButtonStyle = {
      bgColor: "#838282",
      border: "solid",
      borderColor: "#ffffff",
      borderWidth: "5px",
    };
  }

  function updateSelections() {
    if (itemsToDelete.indexOf(idx) > -1) {
      var temp = itemsToDelete.filter((e) => e != idx);
      updateItemsToDelete(temp);
    } else {
      var temp = [...itemsToDelete];
      temp.push(idx);
      updateItemsToDelete(temp);
    }
  }

  return (
    <Box
      borderRadius="12px"
      bgColor="#EEEEEE"
      padding={3}
      border={cardStyle.border}
      maxW={"530px"}
    >
      <Flex
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <SimpleGrid
          spacing={0}
          columns={{ sm: 1, md: 2, lg: 2 }}
          alignItems="center"
        >
          <Box>
            <Text fontWeight="bold">Fname Lname</Text>
            <Text>{account.email}</Text>
          </Box>

          <Flex
            direction={"row"}
            alignItems={"center"}
            justifyContent={{ sm: "flex-start", md: "center", lg: "center" }}
          >
            {selectItems ? (
              <Box
                as="button"
                bgColor="#CECCCC"
                borderRadius="8px"
                width="147px"
                height="36px"
              >
                {createLabel(account.role)}
              </Box>
            ) : (
              <RoleSelector
                account={account}
                accountList={accountList}
                updateAccountList={updateAccountList}
              ></RoleSelector>
            )}
          </Flex>
        </SimpleGrid>

        {selectItems ? (
          <Box
            border={selectButtonStyle.border}
            borderWidth={selectButtonStyle.borderWidth}
            borderColor={selectButtonStyle.borderColor}
            bgColor={selectButtonStyle.bgColor}
            borderRadius="15px"
            width="30px"
            height="30px"
            onClick={updateSelections}
          ></Box>
        ) : (
          <></>
        )}
      </Flex>
    </Box>
  );
}

export default AccountCard;
