import { IAccount } from "../db/models/Account";
import RoleSelector from "./RoleSelector";
import { Box, Flex, SimpleGrid, Text, Wrap } from "@chakra-ui/react";
import styles from "./AccessManagementPage.module.css";

interface PropertyType {
  account: IAccount;
  selectItems: boolean;
  itemsToDelete: IAccount[];
  updateItemsToDelete: Function;
  accountList: IAccount[];
  updateAccountList: Function;
  key: Number;
}

function AccountCard(props: PropertyType) {
  const {
    account,
    selectItems,
    itemsToDelete,
    updateItemsToDelete,
    accountList,
    updateAccountList,
  } = props;

  const fill = styles.selectButtonFilled.toString();
  const unfill = styles.selectButtonUnfilled.toString();
  const outlineItem = styles.outlineItem.toString();
  const noOutlineItem = styles.noOutlineItem.toString();

  function updateSelections() {
    if (itemsToDelete.indexOf(account) > -1) {
      var temp = itemsToDelete.filter((e) => e != account);
      updateItemsToDelete(temp);
    } else {
      var temp = [...itemsToDelete];
      temp.push(account);
      updateItemsToDelete(temp);
    }
  }

  return (
    <Box
      borderRadius="12px"
      bgColor="#EEEEEE"
      padding={3}
      className={`${
        itemsToDelete.indexOf(account) > -1 ? outlineItem : noOutlineItem
      }`}
    >
      <Flex
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <SimpleGrid
          spacing={5}
          columns={{ sm: 1, md: 1, lg: 2 }}
          alignItems="center"
        >
          <Box>
            <Text flexWrap="wrap" fontWeight="bold">
              Fname Lname
            </Text>
            <Text wordBreak="inherit">{account.email}</Text>
          </Box>
          <RoleSelector
            account={account}
            accountList={accountList}
            updateAccountList={updateAccountList}
          ></RoleSelector>
        </SimpleGrid>
        {selectItems ? (
          <Box
            className={`${itemsToDelete.indexOf(account) > -1 ? fill : unfill}`}
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
